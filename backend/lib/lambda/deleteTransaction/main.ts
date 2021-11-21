import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { EventBridgeDetail } from '../types/Event';
import { TransactionData } from './../types/Transaction';

exports.handler = async (event: EventBridgeEvent<string, TransactionData>) => {
  const eventString: string = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  const detail: EventBridgeDetail = JSON.parse(eventString).detail;
  const data: TransactionData = JSON.parse(detail.data);

  // Delete Transactions
  await deleteTransactionsAsync(data);

  // Publish event to update positions
  await publishEventAsync(detail, event);
};

async function deleteTransactionsAsync(data: TransactionData) {
  console.log(`🔔 Deleting Transaction: ${data.id}`);

  const input = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Key: marshall({
      id: data.id,
    }),
  };

  await dynamoDbCommand(new DeleteItemCommand(input));
  console.log('✅ Deleted Transaction');
}

async function publishEventAsync(detail: EventBridgeDetail, event: EventBridgeEvent<string, TransactionData>) {
  var params = {
    Entries: [
      {
        Source: event.source,
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: 'TransactionSavedEvent',
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
    console.error(error);
  } finally {
    console.log(`✅ Successfully sent ${params.Entries.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
}

async function dynamoDbCommand(command: typeof DeleteItemCommand) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`DynamoDB result:\n${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
  }

  return result;
}
