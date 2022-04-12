const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { DeleteTransactionInput } from '../types/Transaction';

async function deleteTransaction(input: DeleteTransactionInput) {
  // Delete Transactions
  return await deleteTransactionAsync(input);
}

async function deleteTransactionAsync(input: DeleteTransactionInput) {
  console.log(`🔔 Deleting Transaction: ${input.id}`);

  const delInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Key: marshall({
      id: input.id,
    }),
  };

  let result = await dynamoDbCommand(new DeleteItemCommand(delInput));

  // Publish event to update positions
  if (result === true) {
    await publishEventAsync(input);
  }

  console.log('✅ Deleted Transaction: ', { id: input.id });
  return { id: input.id };
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
    return false;
  }

  return true;
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
