import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getTransactions(userId: string, aggregateId: string) {
  console.debug(`🕧 Get Transactions Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-lsi',
    //TODO How to handle more than 100?
    Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'entity = :v3',
    ExpressionAttributeValues: {
      ':v1': { S: userId },
      ':v2': { S: aggregateId },
      ':v3': { S: 'transaction' },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Transactions: ${JSON.stringify(result)}`);

    var res: any = [];
    result.Items.forEach((i: any) => {
      res.push(unmarshall(i));
    });

    console.log(`✅ Found Transactions: ${JSON.stringify(res)}`);
    return res;
  }

  console.log(`🛑 Could not find any Transactions`);
  return [];
}

export default getTransactions;
