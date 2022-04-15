const { DynamoDBClient, QueryCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { UpdateAccountInput } from '../types/Account';

async function updateAccount(input: UpdateAccountInput) {
  console.log(`Updating Account: ${input.aggregateId}`);

  // Get account
  const queryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-index',
    Limit: 1,
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'entity = :v3',
    ExpressionAttributeValues: {
      ':v1': { S: input.userId },
      ':v2': { S: input.aggregateId },
      ':v3': { S: 'account' },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result && result.Items) {
    // TODO Get first item of result
    var r = unmarshall(result.Items[0]);
    console.log('🔔 Returned item: ', r);

    const updateItemCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      Key: marshall({
        userId: r.userId,
        createdAt: r.createdAt,
      }),
      UpdateExpression: 'SET #type=:type, #name=:name, description=:description, updatedAt=:updatedAt',
      ExpressionAttributeValues: marshall({
        ':type': input.type,
        ':name': input.name,
        ':description': input.description,
        ':updatedAt': new Date().toISOString(),
      }),
      ExpressionAttributeNames: {
        '#type': 'type',
        '#name': 'name',
      },
      ReturnValues: 'ALL_NEW',
    };
    var updateResult = await dynamoDbCommand(new UpdateItemCommand(updateItemCommandInput));
    console.log(`🔔 Updated item in DynamoDB: ${JSON.stringify(result)}`);

    console.log(`✅ Updated Account: ${JSON.stringify(unmarshall(updateResult.Attributes))}`);
    return unmarshall(updateResult.Attributes);
  }

  console.log(`🔔 Could not find Account to update`);
  return {};
}

async function dynamoDbCommand(command: any) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`DynamoDB result:\n${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
    return error;
  }
}

export default updateAccount;
