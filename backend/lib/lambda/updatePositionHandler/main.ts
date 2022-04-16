import { EventBridgeEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const { getTimeSeries, getSymbol } = require('./yahooFinance');

import { CreateTransactionInput, TransactionReadModel } from '../types/Transaction';
import { PositionReadModel } from '../types/Position';
import { TimeSeriesReadModel } from '../types/TimeSeries';
import { QueryCommandInput } from '@aws-sdk/client-dynamodb';
import dynamoDbCommand from './helpers/dynamoDbCommand';
import { QueryCommand } from '@aws-sdk/client-dynamodb';

exports.handler = async (event: EventBridgeEvent<string, CreateTransactionInput>) => {
  const detail = parseEvent(event);

  // Get all transactions
  const transactions = await getTransactions(detail);

  // Get current position (if exists)
  const position = await getPosition(detail);

  // Get last transaction date to get the time series
  const { prevLastTransactionDate, lastTransactionDate } = getLastTransactionDate(position, detail);

  // Calculate ACB
  const { positions, acb, bookValue } = calculateAdjustedCostBase(transactions);

  // Get time series
  const timeSeries = await getTimeSeries(detail.symbol, prevLastTransactionDate, detail.transactionDate);

  // CreateTimeSeries - returning the last close
  const lastClose = await createTimeSeries(detail.symbol, timeSeries);

  // Save Position - create if not exists, update if exists
  return await savePosition(position, detail, positions, acb, bookValue, lastTransactionDate, lastClose);
};

// Returns all transactions for the symbol sorted in ascending order
async function getTransactions(detail: CreateTransactionInput): Promise<TransactionReadModel[]> {
  const params: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-index',
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'entity = :v3 AND symbol = :v4',
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':v1': { S: detail.userId },
      ':v2': { S: detail.aggregateId },
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
    IndexName: 'aggregateId-index',
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'entity = :v3 AND symbol = :v4',
    ScanIndexForward: false,
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

// Returns the last transaction date, if null returns the date of the current transaction
function getLastTransactionDate(position: PositionReadModel, detail: CreateTransactionInput) {
  var prevLastTransactionDate = null;
  var lastTransactionDate = null;
  if (position) {
    prevLastTransactionDate = position.lastTransactionDate;
  }
  console.debug(`🕧 Last transaction date: ${prevLastTransactionDate}`);
  console.debug(`🕧 Current transaction date: ${detail.transactionDate}`);

  if (prevLastTransactionDate === detail.transactionDate || prevLastTransactionDate !== detail.transactionDate) {
    console.debug(`🔔 Found new last transaction date: ${detail.transactionDate}`);
    lastTransactionDate = detail.transactionDate;
  }

  // Ensure prevLastTransactionDate is never null
  if (
    prevLastTransactionDate === null ||
    (prevLastTransactionDate && lastTransactionDate && lastTransactionDate < prevLastTransactionDate)
  ) {
    prevLastTransactionDate = lastTransactionDate;
  }

  console.debug(`🔔 Previous last transaction date: ${prevLastTransactionDate}`);
  console.debug(`🔔 Current last transaction date: ${lastTransactionDate}`);

  return { prevLastTransactionDate, lastTransactionDate };
}

function calculateAdjustedCostBase(transactions: TransactionReadModel[]) {
  var acb = 0;
  var positions = 0;
  var bookValue = 0;

  for (const t of transactions) {
    const transactionType = t.type.toUpperCase();

    console.debug(`START-${transactionType} acb: $${acb} positions: ${positions}`);

    if (transactionType.localeCompare('buy', undefined, { sensitivity: 'base' }) === 0) {
      // BUY:  acb = prevAcb + (shares * price + commission)
      acb = acb + (t.shares * t.price + t.commission);

      positions = positions + t.shares;
      bookValue = bookValue + (t.shares * t.price - t.commission);
    } else if (transactionType.localeCompare('sell', undefined, { sensitivity: 'base' }) === 0) {
      // SELL:  acb = prevAcb * ((prevPositions - shares) / prevPositions)
      acb = acb * ((positions - t.shares) / positions);

      positions = positions - t.shares;
      bookValue = bookValue - (t.shares * t.price - t.commission);
    }

    console.debug(`END-${transactionType} acb: $${acb} positions: ${positions}`);
  }

  return { positions, acb, bookValue };
}

async function createTimeSeries(symbol: string, timeSeries: any): Promise<number> {
  // Save timeseries to dynamodb
  const client = new DynamoDBClient({});

  var lastClose = 0;

  await Promise.all(
    timeSeries.map(async (t: TimeSeriesReadModel): Promise<any> => {
      const params: PutItemCommandInput = {
        TableName: process.env.TIME_SERIES_TABLE_NAME,
        Item: marshall({
          symbol: symbol,
          date: t.date,
          open: t.open,
          high: t.high,
          low: t.low,
          close: t.close,
          adjusted_close: t.adjusted_close,
          volume: t.volume,
        }),
      };

      lastClose = t.close;

      console.debug(`Creating TimeSeries: ${JSON.stringify(params.Item)}`);

      try {
        var res = await client.send(new PutItemCommand(params));

        console.log(`🔔 Saved TimeSeries: ${JSON.stringify(res)}`);
      } catch (e) {
        console.error(`🛑 Error saving TimeSeries: ${e}`);
      }
    })
  );

  console.log(`✅ Saved ${timeSeries.length} TimeSeries. Last close: ${lastClose}`);

  return lastClose;
}

async function savePosition(
  position: PositionReadModel,
  detail: CreateTransactionInput,
  positions: number,
  acb: number,
  bookValue: number,
  lastTransactionDate: Date | null,
  lastClose: number
) {
  // Calculate market value
  var marketValue = lastClose * positions;

  // Get stock info
  var symbol = await getSymbol(detail.symbol);
  console.log(`Overview: ${JSON.stringify(symbol)}`);

  var item = {
    userId: detail.userId,
    createdAt: position ? position.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    aggregateId: detail.aggregateId,
    entity: 'position',
    symbol: detail.symbol,
    description: symbol.description,
    exchange: symbol.exchange,
    currency: symbol.currency,
    shares: positions,
    acb: acb,
    bookValue: bookValue,
    marketValue: marketValue,
    lastTransactionDate: lastTransactionDate,
  };

  const putItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved Position: ${JSON.stringify(result)}`);
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
