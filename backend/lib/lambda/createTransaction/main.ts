import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

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
  transactionReadModelAccountId: number;
  transactionReadModelTransactionTypeId: number;
};

exports.handler = async (event: EventBridgeEvent<string, Transaction>) => {
  var eventString = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // Create Transaction
  var successful = await createTransactionAsync(detail, data);

  // Publish event to update positions
  if (successful === true) {
    await publishEventAsync(detail, event);
  }
};

async function createTransactionAsync(detail: Detail, data: Transaction) {
  var client = new DynamoDBClient({ region: process.env.REGION });

  var item = {
    id: uuidv4(),
    aggregateId: detail.aggregateId,
    version: detail.version,
    userId: detail.userId,
    transactionDate: data.transactionDate,
    symbol: data.symbol,
    shares: data.shares,
    price: data.price,
    commission: data.commission,
    transactionReadModelAccountId: `${data.transactionReadModelAccountId}`,
    transactionReadModelTransactionTypeId: `${data.transactionReadModelTransactionTypeId}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Item: marshall(item),
  };
  const command = new PutItemCommand(putItemCommandInput);

  var result;
  try {
    console.log('🔔 Saving item to DynamoDB');
    console.debug(`DynamoDB item: ${JSON.stringify(putItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with saving DynamoDB item`, error);
    return false;
  }

  console.log(`✅ Saved item to DynamoDB: ${JSON.stringify(result)}`);
  return true;
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
