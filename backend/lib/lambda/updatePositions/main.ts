import { EventBridgeEvent } from 'aws-lambda';
import { QueryCommand, QueryCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const { getQuoteSummary } = require('./yahooFinance');

import { CreateTransactionInput, TransactionReadModel } from '../types/Transaction';
import { PositionReadModel } from '../types/Position';
import dynamoDbCommand from './helpers/dynamoDbCommand';

exports.handler = async (event: EventBridgeEvent<string, CreateTransactionInput>) => {
  const detail = parseEvent(event);

  // Get all transactions
  const transactions = await getTransactions(detail);

  // Calculate ACB
  const { shares, acb, bookValue } = calculateAdjustedCostBase(transactions);

  // Save Position - create if not exists, update if exists
  return await savePosition(detail, shares, acb, bookValue);
};

// Returns all transactions for the symbol sorted in ascending order
async function getTransactions(detail: CreateTransactionInput): Promise<TransactionReadModel[]> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-gsi',
    ScanIndexForward: true,
    KeyConditionExpression: 'aggregateId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3 AND symbol = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: detail.aggregateId },
      ':v2': { S: detail.userId },
      ':v3': { S: 'transaction' },
      ':v4': { S: detail.symbol },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(params));

  if (result.$metadata.httpStatusCode === 200) {
    const transactions = result.Items?.map((Item: any) => unmarshall(Item));

    console.log(`🔔 Found ${transactions.length} Transactions: ${JSON.stringify(transactions)}`);

    return transactions;
  }

  console.log(`🛑 Could not find transactions: ${result}`);
  return [] as TransactionReadModel[];
}

async function getPosition(detail: CreateTransactionInput): Promise<PositionReadModel> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-lsi',
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'entity = :v3 AND symbol = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: detail.userId },
      ':v2': { S: detail.aggregateId },
      ':v3': { S: 'position' },
      ':v4': { S: detail.symbol },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(params));

  if (result.$metadata.httpStatusCode === 200) {
    const position = result.Items?.map((Item: any) => unmarshall(Item))[0];

    console.log(`🔔 Found Position: ${JSON.stringify(position)}`);

    return position;
  }

  console.log(`🛑 Could not find Position: ${result}`);
  return {} as PositionReadModel;
}

function calculateAdjustedCostBase(transactions: TransactionReadModel[]) {
  var acb = 0;
  var shares = 0;
  var bookValue = 0;

  for (const t of transactions) {
    const transactionType = t.type.toUpperCase();

    console.debug(`START-${transactionType} acb: $${acb} positions: ${shares}`);

    if (transactionType.localeCompare('buy', undefined, { sensitivity: 'base' }) === 0) {
      // BUY:  acb = prevAcb + (shares * price + commission)
      acb = acb + (t.shares * t.price + t.commission);

      shares = shares + t.shares;
      bookValue = bookValue + (t.shares * t.price - t.commission);
    } else if (transactionType.localeCompare('sell', undefined, { sensitivity: 'base' }) === 0) {
      // SELL:  acb = prevAcb * ((prevPositions - shares) / prevPositions)
      acb = acb * ((shares - t.shares) / shares);

      shares = shares - t.shares;
      bookValue = bookValue - (t.shares * t.price - t.commission);
    }

    console.debug(`END-${transactionType} acb: $${acb} positions: ${shares}`);
  }

  return { shares, acb, bookValue };
}

async function savePosition(detail: CreateTransactionInput, shares: number, acb: number, bookValue: number) {
  // Get current position (if exists)
  const position = await getPosition(detail);

  // Get quote for symbol
  const quote = await getQuoteSummary(detail.symbol);

  // Calculate market value
  var marketValue = quote.close * shares;

  var item = {
    userId: detail.userId,
    sk: position ? position.sk : 'ACCPOS#' + new Date().toISOString(),
    createdAt: position ? position.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aggregateId: detail.aggregateId,
    entity: 'position',
    symbol: quote.symbol,
    description: quote.description,
    exchange: quote.exchange,
    currency: quote.currency,
    shares: shares,
    acb: acb,
    bookValue: bookValue,
    marketValue: marketValue,
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved Position: { result: ${result}, items: ${item} }`);
    return result.Items;
  }

  console.log(`🛑 Could not save Position: `, result);
  return {};
}

function parseEvent(event: EventBridgeEvent<string, CreateTransactionInput>): CreateTransactionInput {
  const eventString: string = JSON.stringify(event);

  console.debug(`🕧 Received event: ${eventString}`);

  return JSON.parse(eventString).detail;
}
