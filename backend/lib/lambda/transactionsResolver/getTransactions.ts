import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { LastEvaluatedKey } from '../types/Transaction';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getTransactions(userId: string, aggregateId: string, lastEvaluatedKey: LastEvaluatedKey) {
  console.debug(`🕧 Get Transactions Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-gsi',
    //TODO TEMP Limit to 3
    Limit: 3,
    ScanIndexForward: false,
    KeyConditionExpression: 'aggregateId = :v1',
    FilterExpression: 'userId = :v2 AND entity = :v3',
    ExpressionAttributeValues: {
      ':v1': { S: aggregateId },
      ':v2': { S: userId },
      ':v3': { S: 'transaction' },
    },
  };
  lastEvaluatedKey ? (queryCommandInput.ExclusiveStartKey = marshall(lastEvaluatedKey)) : lastEvaluatedKey;
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Transactions: ${JSON.stringify(result)}`);

    // Check for LastEvaluatedKey
    var lastEvalKey;
    if (result.LastEvaluatedKey) {
      let lek = unmarshall(result.LastEvaluatedKey);
      lastEvalKey = lek ? lek : '';
    }

    var transactions: any = [];
    result.Items.forEach((i: any) => {
      transactions.push(unmarshall(i));
    });

    let res = { items: transactions, lastEvaluatedKey: lastEvalKey };
    console.log(`✅ Found Transactions: ${JSON.stringify(res)}`);
    return res;
  }

  console.log(`🛑 Could not find any Transactions`);
  return [];
}

export default getTransactions;
