import { EventBridgeEvent } from 'aws-lambda';
import { QueryCommand, QueryCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { InvestmentTransaction } from '../../appsync/api/codegen/appsync';
import dynamoDbCommand from './utils/dynamoDbClient';
import { getQuoteSummary } from './utils/yahooFinance';
import { PositionReadModel } from './types/PositionReadModel';
import publishEventAsync from './utils/eventBridgeClient';

exports.handler = async (event: EventBridgeEvent<string, InvestmentTransaction>) => {
  const detail = parseEvent(event);

  // Get all transactions
  const transactions = await getTransactions(detail);

  // Calculate ACB
  const { shares, bookValue } = calculateAdjustedCostBase(transactions);

  // Get current position (if exists)
  let position = await getPosition(detail);

  // Save Position - create if not exists, update if exists
  position = await savePosition(position, detail, shares, bookValue);

  // Publish PositionUpdatedEvent
  await publishEventAsync('PositionUpdatedEvent', {
    accountId: position.accountId,
    amount: position.marketValueChange,
  });

  return position;
};

// Returns all transactions for the symbol sorted in ascending order
export async function getTransactions(detail: InvestmentTransaction): Promise<InvestmentTransaction[]> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'transaction-gsi',
    ScanIndexForward: true,
    KeyConditionExpression: 'accountId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3 AND symbol = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: detail.accountId },
      ':v2': { S: detail.userId },
      ':v3': { S: 'investment-transaction' },
      ':v4': { S: detail.symbol },
    },
  };
  const result = await dynamoDbCommand(new QueryCommand(params));

  if (result.$metadata.httpStatusCode === 200) {
    // Sort transactions in ascending order by transactionDate and then createdAt in case multiple transactions with the same transactionDate
    const transactions = result.Items?.map((Item: Record<string, InvestmentTransaction>) => unmarshall(Item)).sort(
      (a: InvestmentTransaction, b: InvestmentTransaction) => {
        const dateCompare = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        return dateCompare === 0 ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : dateCompare;
      }
    );

    console.info(`🔔 Found ${transactions.length} Transactions: ${JSON.stringify(transactions)}`);

    return transactions;
  }

  throw new Error(`🛑 Could not find any transactions: ${result}`);
}

async function getPosition(detail: InvestmentTransaction): Promise<PositionReadModel> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'accountId-gsi',
    KeyConditionExpression: 'accountId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3 AND symbol = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: detail.accountId },
      ':v2': { S: detail.userId },
      ':v3': { S: 'position' },
      ':v4': { S: detail.symbol },
    },
  };
  const result = await dynamoDbCommand(new QueryCommand(params));

  let position;
  if (result.$metadata.httpStatusCode === 200) {
    position = result.Items?.map((Item: Record<string, any>) => unmarshall(Item))[0];
  }

  position ? console.log(`🔔 Found existing Position: ${position}`) : console.log(`🔔 No existing Position found: ${result}`);

  return position as PositionReadModel;
}

export function calculateAdjustedCostBase(transactions: InvestmentTransaction[]) {
  let shares = 0;
  let bookValue = 0;

  for (const t of transactions) {
    const transactionType = t.type.toUpperCase();

    console.debug(`START-${transactionType} positions: ${shares}`);

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

    console.debug(`END-${transactionType} positions: ${shares}`);
  }

  return { shares, bookValue };
}

async function savePosition(
  position: PositionReadModel,
  detail: InvestmentTransaction,
  shares: number,
  bookValue: number
): Promise<PositionReadModel> {
  const quote = await getQuoteSummary(detail.symbol);

  if (!quote || !quote.close || !quote.currency) {
    throw new Error(`🛑 Could not get quote for ${detail.symbol}`);
  }

  // Calculate market value
  const marketValue = quote.close * shares;

  const item: PositionReadModel = {
    pk: position ? position.pk : 'pos#' + detail.accountId,
    userId: detail.userId,
    createdAt: position ? position.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    accountId: detail.accountId,
    entity: 'position',
    symbol: detail.symbol,
    description: quote.description ?? '',
    exchange: quote.exchange ?? '',
    currency: quote.currency,
    shares: shares,
    bookValue: bookValue,
    bookValueChange: position ? bookValue - position.bookValue : bookValue,
    marketValue: marketValue,
    marketValueChange: position ? marketValue - position.marketValue : marketValue,
  };

  console.log(`Saving Position: ${JSON.stringify(item)}`);

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };

  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved/Updated Position: { result: ${JSON.stringify(result)}`);
    return item;
  }

  throw new Error(`🛑 Could not save Position ${detail.symbol}: ${result}`);
}

function parseEvent(event: EventBridgeEvent<string, InvestmentTransaction>): InvestmentTransaction {
  const eventString: string = JSON.stringify(event);

  console.debug(`🕧 Received event: ${eventString}`);

  return JSON.parse(eventString).detail;
}
