import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import { UpdateAccountInput } from '../../lambda/types/Account';

async function updateAccount(input: UpdateAccountInput) {
  console.debug(`🕧 Update Account initialized`);

  const updateItemCommandInput: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      userId: input.userId,
      sk: input.sk,
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
    console.log(
      `✅ Updated Account: {result: ${JSON.stringify(updateResult)}, items: ${JSON.stringify(unmarshall(updateResult.Attributes))}}`
    );
    return unmarshall(updateResult.Attributes);
  }

  console.log(`🛑 Could not update Account`);
  return {};
}

export default updateAccount;
