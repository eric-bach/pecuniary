import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getAccounts(userId: string) {
  console.debug(`🕧 Get Accounts Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'entity-index',
    //TODO How to handle more than 100?
    Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND entity = :v2',
    ExpressionAttributeValues: {
      ':v1': { S: userId },
      ':v2': { S: 'account' },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Accounts: ${JSON.stringify(result)}`);

    var res: any = [];
    result.Items.forEach((i: any) => {
      res.push(unmarshall(i));
    });

    console.log(`✅ Found Accounts: ${JSON.stringify(res)}`);
    return res;
  }

  console.log(`🛑 Could not find any Account`);
  return [];
}

export default getAccounts;
