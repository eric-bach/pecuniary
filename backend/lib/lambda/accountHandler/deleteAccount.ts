const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

import { DeleteAccountInput } from '../types/Account';

async function deleteAccount(input: DeleteAccountInput) {
  console.log(`Deleting everything in Account: ${input.aggregateId}`);

  // Get all aggregates
  const queryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-index',
    // TODO Handle if more than 100 items
    //Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    ExpressionAttributeValues: {
      ':v1': { S: input.userId },
      ':v2': { S: input.aggregateId },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result && result.Items) {
    console.log(`Found ${result.Count} aggregates(s) in Account`);

    // Delete all aggregates
    for (const t of result.Items) {
      const deleteInput = {
        TableName: process.env.DATA_TABLE_NAME,
        Key: {
          userId: t.userId,
          createdAt: t.createdAt,
        },
        ConditionExpression: 'aggregateId = :v1',
        ExpressionAttributeValues: {
          ':v1': { S: input.aggregateId },
        },
      };

      await dynamoDbCommand(new DeleteItemCommand(deleteInput));
    }

    console.log(`🔔 Deleted ${result.Count} aggregates(s) in account`);
    console.log(`✅ Deleted Account: {aggregateId: ${input.aggregateId}}`);
    return { aggregateId: input.aggregateId };
  } else {
    console.log(`🔔 No aggregates found in account`);
    return { aggregateId: '' };
  }
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

export default deleteAccount;
