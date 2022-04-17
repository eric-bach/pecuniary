import { QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import { UpdateAccountInput } from '../types/Account';

async function updateAccount(input: UpdateAccountInput) {
  console.debug(`🕧 Update Account initialized`);

  // Get account
  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-index',
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
    var account = unmarshall(result.Items[0]);
    console.log(`🔔 Found Account: ${JSON.stringify(account)}`);

    const updateItemCommandInput: UpdateItemCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      Key: marshall({
        userId: account.userId,
        createdAt: account.createdAt,
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

    if (updateResult.$metadata.httpStatusCode === 200) {
      console.log(`✅ Updated Account: {result: ${JSON.stringify(result)}, items: ${JSON.stringify(unmarshall(updateResult.Attributes))}}`);

      return unmarshall(updateResult.Attributes);
    }
  }

  console.log(`🛑 Could not update Account`);
  return {};
}

export default updateAccount;
