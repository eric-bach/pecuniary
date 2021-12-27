import { EventBridgeEvent } from 'aws-lambda';
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

const { v4: uuid } = require('uuid');
const { getTimeSeries, getSymbol } = require('./yahooFinance');

import { EventBridgeDetail } from '../types/Event';
import { TransactionData, TransactionReadModel } from '../types/Transaction';
import { PositionReadModel } from '../types/Position';
import { TimeSeriesReadModel } from '../types/TimeSeries';

exports.handler = async (event: EventBridgeEvent<string, TransactionData>) => {
  const { detail, data } = parseEvent(event);

  // Get all transactions
  const transactions = await getTransactions(detail, data);

  // Get current position (if exists)
  const position = await getPosition(detail, data);

  // Get last transaction date to get the time series
  const { prevLastTransactionDate, lastTransactionDate } = getLastTransactionDate(position, data);

  // Calculate ACB
  const { positions, acb, bookValue } = calculateAdjustedCostBase(transactions);

  // Get time series
  const timeSeries = await getTimeSeries(data.symbol, prevLastTransactionDate, data.transactionDate);

  // CreateTimeSeries - returning the last close
  const lastClose = await createTimeSeries(data.symbol, timeSeries);

  // Save Position - create if not exists, update if exists
  const savedPosition = await savePosition(
    position,
    detail,
    data,
    positions,
    acb,
    bookValue,
    lastTransactionDate,
    transactions,
    lastClose
  );

  // Publish PositionUpdatedEvent to EventBridge for marketValue and bookValue to be updated
  await publishEventAsync(savedPosition);
};

async function publishEventAsync(position: any) {
  var params = {
    Entries: [
      {
        Source: 'custom.pecuniary',
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: 'PositionUpdatedEvent',
        Detail: JSON.stringify({
          id: position.accountId,
          version: position.version,
          marketValue: position.marketValue,
          bookValue: position.bookValue,
        }),
      },
    ],
  };
  console.debug(`EventBridge event: ${JSON.stringify(params)}`);

  const client = new EventBridgeClient();
  var command = new PutEventsCommand(params);

  var result;
  try {
    console.log(`🔔 Sending ${params.Entries.length} event(s) to EventBridge`);
    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with sending EventBridge event`, error);
  } finally {
    console.log(`✅ Successfully sent ${params.Entries.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
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
          id: `${symbol}-${t.date}`,
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
        console.error(`❌ Error saving TimeSeries: ${e}`);
      }
    })
  );

  console.log(`✅ Saved ${timeSeries.length} TimeSeries. Last close: ${lastClose}`);

  return lastClose;
}

async function savePosition(
  position: PositionReadModel,
  detail: EventBridgeDetail,
  data: TransactionData,
  positions: number,
  acb: number,
  bookValue: number,
  lastTransactionDate: Date | null,
  transactions: TransactionReadModel[],
  lastClose: number
) {
  var result;

  // Calculate market value
  var marketValue = lastClose * positions;

  // Get stock info
  var symbol = await getSymbol(data.symbol);
  console.log(`Overview: ${JSON.stringify(symbol)}`);

  var item = {
    id: position ? position.id : uuid(),
    aggregateId: detail.aggregateId,
    version: position ? position.version + 1 : 1,
    userId: detail.userId,
    symbol: data.symbol,
    name: symbol.name,
    description: symbol.description,
    exchange: symbol.exchange,
    currency: symbol.currency,
    country: symbol.region,
    shares: positions,
    acb: acb,
    bookValue: bookValue,
    marketValue: marketValue,
    lastTransactionDate: lastTransactionDate,
    accountId: transactions[0].accountId,
  };

  const putItemCommandInput = {
    TableName: process.env.POSITION_TABLE_NAME,
    Item: marshall(item),
  };
  const command = new PutItemCommand(putItemCommandInput);

  var result;
  try {
    var client = new DynamoDBClient({ region: process.env.REGION });

    console.log('🔔 Saving item to DynamoDB');
    console.debug(`DynamoDB item: ${JSON.stringify(putItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with saving DynamoDB item`, error);
  }

  console.log(`✅ Saved item to DynamoDB: ${JSON.stringify(result)}`);

  return item;
}

function calculateAdjustedCostBase(transactions: TransactionReadModel[]) {
  var acb = 0;
  var positions = 0;
  var bookValue = 0;

  for (const t of transactions) {
    const transactionType = t.transactionType.name.toUpperCase();

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

// Returns the last transaction date, if null returns the date of the current transaction
function getLastTransactionDate(position: PositionReadModel, data: TransactionData) {
  var prevLastTransactionDate = null;
  var lastTransactionDate = null;
  if (position) {
    prevLastTransactionDate = position.lastTransactionDate;
  }
  console.debug(`Last transaction date: ${prevLastTransactionDate}`);
  console.debug(`Current transaction date: ${data.transactionDate}`);

  if (prevLastTransactionDate === data.transactionDate || prevLastTransactionDate !== data.transactionDate) {
    console.debug(`🔔 Found new last transaction date: ${data.transactionDate}`);
    lastTransactionDate = data.transactionDate;
  }

  // Ensure prevLastTransactionDate is never null
  if (
    prevLastTransactionDate === null ||
    (prevLastTransactionDate && lastTransactionDate && lastTransactionDate < prevLastTransactionDate)
  ) {
    prevLastTransactionDate = lastTransactionDate;
  }

  console.debug(`✔ Previous last transaction date: ${prevLastTransactionDate}`);
  console.debug(`✔ Current last transaction date: ${lastTransactionDate}`);

  return { prevLastTransactionDate, lastTransactionDate };
}

async function getPosition(detail: EventBridgeDetail, data: TransactionData): Promise<PositionReadModel> {
  const params: ScanCommandInput = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'aggregateId',
      '#s': 'symbol',
    },
    ExpressionAttributeValues: {
      ':aggregateId': { S: detail.aggregateId },
      ':symbol': { S: data.symbol },
    },
    FilterExpression: '#a = :aggregateId AND #s = :symbol',
  };

  try {
    console.debug('Searching for Position');

    const client = new DynamoDBClient({});
    const result = await client.send(new ScanCommand(params));
    const positions = result.Items?.map((Item) => unmarshall(Item));

    if (positions) {
      console.log(`🔔 Found Position: ${JSON.stringify(positions[0])}`);

      return positions[0] as PositionReadModel;
    } else {
      console.log(`🔔 No Position found`);

      return {} as PositionReadModel;
    }
  } catch (e) {
    console.log(`❌ Error looking for Position: ${e}`);

    return {} as PositionReadModel;
  }
}

// Returns all transactions for the symbol sorted in ascending order
async function getTransactions(detail: EventBridgeDetail, data: TransactionData): Promise<TransactionReadModel[]> {
  const params: ScanCommandInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'aggregateId',
      '#s': 'symbol',
    },
    ExpressionAttributeValues: {
      ':aggregateId': { S: detail.aggregateId },
      ':symbol': { S: data.symbol },
    },
    FilterExpression: '#a = :aggregateId AND #s = :symbol',
  };

  try {
    console.debug('Searching for Transactions');

    const client = new DynamoDBClient({});
    const result = await client.send(new ScanCommand(params));

    const transactions = result.Items?.map((Item) => unmarshall(Item));

    if (transactions) {
      const sortedTransactions = transactions.sort(orderByTransactionDate);
      console.log(`🔔 Found ${transactions.length} Transactions: ${JSON.stringify(sortedTransactions)}`);

      return sortedTransactions as TransactionReadModel[];
    } else {
      console.log(`🔔 No Transactions found`);

      return [] as TransactionReadModel[];
    }
  } catch (e) {
    console.log(`❌ Error looking for Transactions: ${e}`);

    return [] as TransactionReadModel[];
  }
}

function parseEvent(event: EventBridgeEvent<string, TransactionData>) {
  const eventString: string = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  const detail: EventBridgeDetail = JSON.parse(eventString).detail;
  const data: TransactionData = JSON.parse(detail.data);

  return { detail, data };
}

// Order by transactionDate asc then transactionType asc
function orderByTransactionDate(a: any, b: any): number {
  var d1 = new Date(a.transactionDate).toISOString();
  var d2 = new Date(b.transactionDate).toISOString();

  if (d1 < d2) {
    return -1;
  }
  if (d1 > d2) {
    return 1;
  }
  if (a.transactionType.id <= b.transactionType.id) {
    return -1;
  }

  return 1;
}
