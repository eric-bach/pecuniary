const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

import { CreateTransactionInput, TransactionReadModel } from '../types/Transaction';

async function createTransaction(input: CreateTransactionInput) {
  var item: TransactionReadModel = {
    userId: input.userId,
    aggregateId: input.aggregateId,
    entity: 'transaction',
    type: input.type,
    transactionDate: input.transactionDate,
    symbol: input.symbol,
    shares: input.shares,
    price: input.price,
    commission: input.commission,
    exchange: input.exchange,
    currency: input.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result && result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved item to DynamoDB: ${JSON.stringify({ result: result, item: unmarshall(putItemCommandInput.Item) })}`);

    // Publish event to update positions
    await publishEventAsync(input);

    return unmarshall(putItemCommandInput.Item);
  }
  return {};
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

async function dynamoDbCommand(command: any) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`🔔 DynamoDB result:\n${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
    return error;
  }
}

export default createTransaction;
