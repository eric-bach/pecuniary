const { DynamoDBClient, QueryCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

import { QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { UpdateTransactionInput } from '../types/Transaction';

async function updateTransaction(input: UpdateTransactionInput) {
  console.log(`Update Transaction: ${input.aggregateId}`);

  // Get transaction
  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    // BUG Querying with the LSI does not return data in the SDK only (works in console and CLI)
    //IndexName: 'aggregateId-index',
    Limit: 1,
    KeyConditionExpression: 'userId = :v1 AND createdAt = :v2',
    FilterExpression: 'aggregateId = :v3 AND entity = :v4',
    ExpressionAttributeValues: {
      ':v1': { S: input.userId },
      ':v2': { S: input.createdAt },
      ':v3': { S: input.aggregateId },
      ':v4': { S: 'transaction' },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200 && result.Count > 0) {
    // TODO Get first item of result
    var r = unmarshall(result.Items[0]);
    console.log('🔔 Returned item: ', r);

    const updateItemCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      Key: marshall({
        userId: input.userId,
        createdAt: input.createdAt,
      }),
      UpdateExpression:
        'SET #type=:type, transactionDate=:transactionDate, symbol=:symbol, shares=:shares, price=:price, commission=:commission, updatedAt=:updatedAt, exchange=:exchange, currency=:currency',
      ExpressionAttributeValues: marshall({
        ':type': input.type,
        ':transactionDate': input.transactionDate,
        ':symbol': input.symbol,
        ':shares': input.shares,
        ':price': input.price,
        ':commission': input.commission,
        ':exchange': input.exchange,
        ':currency': input.currency,
        ':updatedAt': new Date().toISOString(),
      }),
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ReturnValues: 'ALL_NEW',
    };
    var updateResult = await dynamoDbCommand(new UpdateItemCommand(updateItemCommandInput));

    if (updateResult && updateResult.$metadata.httpStatusCode === 200) {
      console.log(`🔔 Updated item in DynamoDB: ${JSON.stringify(updateResult)}`);

      // Publish event to update positions
      await publishEventAsync(input);

      console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(updateResult)}`);
      return unmarshall(updateResult.Attributes);
    }

    console.log(`❌ Could not update transaction\n`, updateResult);
    return {};
  }

  console.log(`🔔 Could not find transaction to update`);
  return {};
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

export default updateTransaction;
