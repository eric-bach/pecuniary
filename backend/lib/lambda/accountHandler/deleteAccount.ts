const { QueryCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

import dynamoDbCommand from './helpers/dynamoDbCommand';
import { DeleteAccountInput } from '../types/Account';

async function deleteAccount(input: DeleteAccountInput) {
  console.debug(`🕧 Delete Account initialized`);

  // Get all aggregates
  console.debug(`🕧 Getting all aggregates related to Account ${input.aggregateId}`);
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

  if (result.$metadata.httpStatusCode === 200 && result.Count > 0) {
    console.log(`🔔 Found ${result.Count} aggregates(s) in Account`);

    // Delete each aggregate
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

      var aResult = await dynamoDbCommand(new DeleteItemCommand(deleteInput));
      console.debug(`🕧 Deleted aggregate ${JSON.stringify(aResult)}`);
    }

    console.log(`🔔 Deleted ${result.Count} aggregates(s) in Account`);

    console.log(`✅ Deleted Account: {aggregateId: ${input.aggregateId}}`);
    return { aggregateId: input.aggregateId };
  }

  console.log('🛑 Could not delete Account', result);
  return {};
}

export default deleteAccount;
