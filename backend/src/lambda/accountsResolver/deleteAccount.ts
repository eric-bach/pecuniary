import { QueryCommand, QueryCommandInput, DeleteItemCommand, DeleteItemCommandInput } from '@aws-sdk/client-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import { DeleteAccountInput } from '../types/Account';

async function deleteAccount(input: DeleteAccountInput) {
  console.debug(`🕧 Delete Account initialized`);

  // Get all aggregates
  console.debug(`🕧 Getting all aggregates related to Account ${input.aggregateId}`);
  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-lsi',
    // TODO Handle if more than 100 items
    //Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    ExpressionAttributeValues: {
      ':v1': { S: input.userId },
      ':v2': { S: input.aggregateId },
    },
  };
  let result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200 && result.Count > 0) {
    var error = false;

    // Delete each aggregate
    for (const t of result.Items) {
      const deleteItemCommandInput: DeleteItemCommandInput = {
        TableName: process.env.DATA_TABLE_NAME,
        Key: {
          userId: t.userId,
          sk: t.sk,
        },
        ConditionExpression: 'aggregateId = :v1',
        ExpressionAttributeValues: {
          ':v1': t.aggregateId,
        },
      };

      let deleteResult = await dynamoDbCommand(new DeleteItemCommand(deleteItemCommandInput));

      if (!deleteResult || deleteResult.$metadata.httpStatusCode !== 200) {
        error = true;
        break;
      }
    }

    if (!error) {
      console.log(`✅ Deleted Account: { result: ${result}, item: ${input} }`);
      return input;
    }
  }

  console.log('🛑 Could not delete Account', result);
  return {};
}

export default deleteAccount;
