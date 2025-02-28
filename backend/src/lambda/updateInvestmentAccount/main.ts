import { EventBridgeEvent, Handler } from 'aws-lambda';
import { QueryCommand, QueryCommandInput, AttributeValue, UpdateItemCommandInput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import middy from '@middy/core';
import { InvestmentTransaction } from '../../appsync/api/codegen/appsync';
import dynamoDbCommand from '../../utils/dynamoDbClient';
import { getQuoteSummary } from './utils/yahooFinance';
import { PositionReadModel } from './types/PositionReadModel';

const logger = new Logger({ serviceName: 'updateInvestmentAccount' });

const lambdaHandler: Handler = async (event: EventBridgeEvent<string, InvestmentTransaction>) => {
  const transaction = parseEvent(event);

  logger.debug('🔔 Received event', { data: transaction });

  const { accountId, symbol, userId } = transaction;

  // NOTE: This is not the most optimal design but for less than 1,000 transactions the small performance impact outweighs
  // the complexity in building a snapshotting design

  // Get all transactions
  const transactions = await getTransactions(accountId, symbol, userId);

  // Get all positions (not just the position for the current asset symbol)
  const positions = await getPositions(accountId, userId);

  // Save Position (create if not exists, update if exists)
  await updatePosition(accountId, symbol, userId, positions, transactions);

  // Update Account balances by summing up all the book/market value of all positions
  return await updateAccount(transaction.accountId, positions);
};

// Returns all transactions for the symbol sorted in ascending order
export async function getTransactions(accountId: string, symbol: string, userId: string): Promise<InvestmentTransaction[]> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'transaction-gsi',
    ScanIndexForward: true,
    KeyConditionExpression: 'accountId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3 AND symbol = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: accountId },
      ':v2': { S: userId },
      ':v3': { S: 'investment-transaction' },
      ':v4': { S: symbol },
    },
  };
  const result = await dynamoDbCommand(logger, new QueryCommand(params));

  if (result.$metadata.httpStatusCode === 200) {
    // Sort transactions in ascending order by transactionDate and then createdAt in case multiple transactions with the same transactionDate
    const transactions = result.Items?.map((Item: Record<string, AttributeValue>) => unmarshall(Item)).sort(
      (a: InvestmentTransaction, b: InvestmentTransaction) => {
        const dateCompare = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        return dateCompare === 0 ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : dateCompare;
      }
    );

    logger.info('🔔 Found transactions', {
      data: {
        transactions: transactions,
        count: transactions.length,
      },
    });

    return transactions;
  }

  throw new Error(`🛑 Could not find any transactions: ${result}`);
}

export async function getPositions(accountId: string, userId: string): Promise<PositionReadModel[]> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'accountId-gsi',
    KeyConditionExpression: 'accountId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3',
    ExpressionAttributeValues: {
      ':v1': { S: accountId },
      ':v2': { S: userId },
      ':v3': { S: 'position' },
    },
  };
  const result = await dynamoDbCommand(logger, new QueryCommand(params));

  if (result.$metadata.httpStatusCode === 200) {
    const positions: PositionReadModel[] = result.Items.map((item: Record<string, AttributeValue>) => unmarshall(item));

    logger.info('🔔 Found Positions', { data: { positions: positions, count: positions.length } });

    return positions;
  }

  throw new Error(`🛑 Could not find any positions: ${result}`);
}

export function calculateBookValue(transactions: InvestmentTransaction[]) {
  let shares = 0;
  let bookValue = 0;

  for (const t of transactions) {
    const transactionType = t.type.toUpperCase();

    logger.debug(`START-${transactionType} ${t.symbol} ${shares} shares`);

    if (transactionType.localeCompare('buy', undefined, { sensitivity: 'base' }) === 0) {
      // increase bookValue (ACB) by cost of new shares
      bookValue = bookValue + (t.shares * t.price + t.commission);

      // increase number of shares
      shares = shares + t.shares;
    } else if (transactionType.localeCompare('sell', undefined, { sensitivity: 'base' }) === 0) {
      // const capitalGainLoss = (t.shares * t.price - t.commission) - (t.shares * (bookValue / shares););

      // decrease bookValue by number of shares sold * bookValue per share
      bookValue = bookValue - t.shares * (bookValue / shares);

      // decrease number of shares
      shares = shares - t.shares;
    }

    logger.debug(`END-${transactionType} ${t.symbol} ${shares} shares`);
  }

  return { shares, bookValue };
}

export async function calculateMarketValue(symbol: string, shares: number) {
  const quote = await getQuoteSummary(symbol);

  if (!quote || !quote.close || !quote.currency) {
    throw new Error(`🛑 Could not get quote for ${symbol}`);
  }

  // Calculate market value
  const marketValue = quote.close * shares;

  return { quote, marketValue };
}

async function updatePosition(
  accountId: string,
  symbol: string,
  userId: string,
  positions: PositionReadModel[],
  transactions: InvestmentTransaction[]
): Promise<PositionReadModel> {
  // Calculate bookValue and marketValue
  const { shares, bookValue } = calculateBookValue(transactions);
  const { quote, marketValue } = await calculateMarketValue(symbol, shares);

  // Find the existing position for the symbol (if exists)
  let position = positions.find((pos) => pos.symbol === symbol);

  if (position === undefined) {
    position = {
      pk: `pos#${symbol}#${accountId}`,
      entity: 'investment-transaction',
      accountId,
      symbol,
      userId,
      shares,
      bookValue,
      marketValue,
      description: quote.description ?? '',
      exchange: quote.exchange ?? '',
      currency: quote.currency ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    logger.info('Creating a new position', { data: { position: position } });

    positions.push(position);
  } else {
    position.shares = shares;
    position.bookValue = bookValue;
    position.marketValue = marketValue;

    console.info('Updating existing position', { data: { position: position } });
  }

  const updateItemCommandInput: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      pk: `pos#${symbol}#${accountId}`,
    }),
    UpdateExpression: `SET 
      userId = :userId,
      createdAt = if_not_exists(createdAt, :createdAt),
      updatedAt = :updatedAt,
      accountId = :accountId,
      entity = :entity,
      symbol = :symbol,
      description = :description,
      exchange = :exchange,
      currency = :currency,
      shares = :shares,
      bookValue = :bookValue,
      marketValue = :marketValue`,
    ExpressionAttributeValues: marshall({
      ':userId': userId,
      ':createdAt': new Date().toISOString(),
      ':updatedAt': new Date().toISOString(),
      ':accountId': accountId,
      ':entity': 'position',
      ':symbol': symbol,
      ':description': quote.description ?? '',
      ':exchange': quote.exchange ?? '',
      ':currency': quote.currency,
      ':shares': shares,
      ':bookValue': bookValue,
      ':marketValue': marketValue,
    }),
  };

  logger.info('Saving Position', { data: updateItemCommandInput });

  const result = await dynamoDbCommand(logger, new UpdateItemCommand(updateItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    logger.info('✅ Saved/Updated Position', { result: result });

    return position;
  }

  throw new Error(`🛑 Could not save Position ${symbol}: ${result}`);
}

async function updateAccount(accountId: string, positions: PositionReadModel[]): Promise<UpdateItemCommandInput> {
  logger.info(`Updating account with ${positions.length} positions`);

  const bookValue = positions.reduce((sum, pos) => sum + pos.bookValue, 0);
  const marketValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);

  logger.debug('Book Value', { bookValue: bookValue });
  logger.debug('Market Value', { marketValue: marketValue });

  // update dynamodb account
  const input: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({ pk: `acc#${accountId}` }),
    UpdateExpression: 'SET bookValue = :bookValue, marketValue = :marketValue, updatedAt = :updatedAt',
    ExpressionAttributeValues: marshall({
      ':bookValue': bookValue,
      ':marketValue': marketValue,
      ':updatedAt': new Date().toISOString(),
    }),
    ReturnValues: 'UPDATED_NEW',
  };

  logger.debug('Updating account', { data: input });

  const result = await dynamoDbCommand(logger, new UpdateItemCommand(input));

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`🛑 Could not update investment account ${accountId}`);
  }

  return input;
}

function parseEvent(event: EventBridgeEvent<string, InvestmentTransaction>): InvestmentTransaction {
  const eventString: string = JSON.stringify(event);

  logger.debug('Parsing event', { data: eventString });

  return JSON.parse(eventString).detail;
}

export const handler = middy(lambdaHandler).use(injectLambdaContext(logger));
