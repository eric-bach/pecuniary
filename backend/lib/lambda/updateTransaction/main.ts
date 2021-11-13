import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');

type Detail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
};
type Transaction = {
  id: string;
  transactionDate: Date;
  symbol: string;
  shares: number;
  price: number;
  commission: number;
  accountId: number;
  transactionTypeId: number;
};

exports.handler = async (event: EventBridgeEvent<string, Transaction>) => {
  var eventString = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // update Transaction
  await updateTransactionAsync(detail, data);

  // Publish event to update positions
  await publishEventAsync(detail, event);
};

async function updateTransactionAsync(detail: Detail, data: Transaction) {
  const updateItemCommandInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Key: marshall({
      id: data.id,
    }),
    UpdateExpression:
      'SET version=:version, transactionDate=:transactionDate, symbol=:symbol, shares=:shares, price=:price, commission=:commission, transactionTypeId=:transactionTypeId',
    ExpressionAttributeValues: marshall({
      ':version': detail.version,
      ':transactionDate': data.transactionDate,
      ':symbol': data.symbol,
      ':shares': data.shares,
      ':price': data.price,
      ':commission': data.commission,
      ':transactionTypeId': `${data.transactionTypeId}`,
    }),
    ReturnValues: 'ALL_NEW',
  };
  const command = new UpdateItemCommand(updateItemCommandInput);

  var result;
  try {
    var client = new DynamoDBClient({ region: process.env.REGION });

    console.log('🔔 Updating DynamoDB item');
    console.debug(`DynamoDB item: ${JSON.stringify(updateItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with updating DynamoDB item`, error);
  }

  console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(result)}`);
}

async function publishEventAsync(detail: Detail, event: EventBridgeEvent<string, Transaction>) {
  var params = {
    Entries: [
      {
        Source: event.source,
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: 'TransactionSavedEvent', // TODO have to hard-code because we cannot access event.detailtype to modify it
        Detail: JSON.stringify(detail),
      },
    ],
  };
  console.debug(`🔔 EventBridge event: ${JSON.stringify(params)}`);

  const client = new EventBridgeClient();
  var command = new PutEventsCommand(params);

  var result;
  try {
    console.log(`Sending ${params.Entries.length} event(s) to EventBridge`);
    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with sending EventBridge event`, error);
  } finally {
    console.log(`✅ Successfully sent ${params.Entries.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
}
