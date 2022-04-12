const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

import { UpdateTransactionInput } from '../types/Transaction';

async function updateTransaction(input: UpdateTransactionInput) {
  // update Transaction
  return await updateTransactionAsync(input);
}

async function updateTransactionAsync(input: UpdateTransactionInput) {
  const updateItemCommandInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    Key: marshall({
      id: input.id,
    }),
    UpdateExpression:
      'SET version=:version, transactionDate=:transactionDate, symbol=:symbol, shares=:shares, price=:price, commission=:commission, transactionType=:transactionType',
    ExpressionAttributeValues: marshall({
      ':version': input.version + 1,
      ':transactionDate': input.transactionDate,
      ':symbol': input.symbol,
      ':shares': input.shares,
      ':price': input.price,
      ':commission': input.commission,
      ':transactionType': `{ id: ${input.transactionTypeId}, name: ${input.transactionTypeName}, description: ${input.transactionTypeDescription} }`,
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
    return error;
  }

  // Publish event to update positions
  await publishEventAsync(input);

  console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(result)}`);
  return unmarshall(result.Attributes);
}

async function publishEventAsync(input: UpdateTransactionInput) {
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

export default updateTransaction;
