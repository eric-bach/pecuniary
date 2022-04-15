const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { DeleteItemCommandInput } from '@aws-sdk/client-dynamodb';
import { DeleteTransactionInput } from '../types/Transaction';

async function deleteTransaction(input: DeleteTransactionInput) {
  console.log(`Deleting Transaction: ${input.aggregateId}`);

  const deleteItemCommandInput: DeleteItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      userId: input.userId,
      createdAt: input.createdAt,
    }),
  };
  let result = await dynamoDbCommand(new DeleteItemCommand(deleteItemCommandInput));

  // Publish event to update positions
  if (result.$metadata.httpStatusCode === 200) {
    console.log('✅ Deleted Transaction: ', { aggregateId: input.aggregateId });

    await publishEventAsync(input);
  }

  return { aggregateId: input.aggregateId };
}

async function dynamoDbCommand(command: typeof DeleteItemCommand) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`🔔 DynamoDB result:\n${JSON.stringify(result)}`);
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
    return error;
  }

  return result;
}

async function publishEventAsync(input: DeleteTransactionInput) {
  var params = {
    Entries: [
      {
        Source: 'custom.pecuniary',
        EventBusName: process.env.EVENTBUS_PECUNIARY_NAME,
        DetailType: 'TransactionSavedEvent',
        Detail: JSON.stringify(input),
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

export default deleteTransaction;
