const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

import { CreateTransactionInput, TransactionReadModel } from '../types/Transaction';

async function createTransaction(input: CreateTransactionInput) {
  // Create Transaction
  var successful = await createTransactionAsync(input);

  // Publish event to update positions
  if (successful === true) {
    await publishEventAsync(input);
  }
}

async function createTransactionAsync(input: CreateTransactionInput) {
  var client = new DynamoDBClient({ region: process.env.REGION });

  var item: TransactionReadModel = {
    id: uuidv4(),
    aggregateId: input.aggregateId,
    version: 1,
    userId: input.userId,
    transactionDate: input.transactionDate,
    symbol: input.symbol,
    shares: input.shares,
    price: input.price,
    commission: input.commission,
    accountId: `${input.accountId}`,
    transactionType: {
      id: input.transactionTypeId,
      name: input.transactionTypeName,
      description: input.transactionTypeDescription,
    },
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

async function publishEventAsync(input: CreateTransactionInput) {
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
    console.error(`❌ Error with sending EventBridge event`, error);
  } finally {
    console.log(`✅ Successfully sent ${params.Entries.length} event(s) to EventBridge: ${JSON.stringify(result)}`);
  }
}

export default createTransaction;
