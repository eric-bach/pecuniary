import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getPositions(userId: string, aggregateId: string) {
  console.debug(`🕧 Get Positions Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    //TODO How to handle more than 100?
    Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND begins_with(sk, :v2)',
    FilterExpression: 'aggregateId = :v3',
    ExpressionAttributeValues: {
      ':v1': { S: userId },
      ':v2': { S: 'ACCPOS' },
      ':v3': { S: aggregateId },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Positions: ${JSON.stringify(result)}`);

    var res: any = [];
    result.Items.forEach((i: any) => {
      res.push(unmarshall(i));
    });

    console.log(`✅ Found Positions: ${JSON.stringify(res)}`);
    return res;
  }

  console.log(`🛑 Could not find any Positions`);
  return [];
}

export default getPositions;
