import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

async function getAccountByAggregateId(aggregateId: string) {
  console.debug(`getAccountByAggregateId: ${JSON.stringify(aggregateId)}`);

  const params: ScanCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'aggregateId',
    },
    ExpressionAttributeValues: {
      ':aggregateId': { S: aggregateId },
    },
    FilterExpression: '#a = :aggregateId',
  };

  try {
    console.debug('Searching for Account with aggregateId: ', aggregateId);
    const client = new DynamoDBClient({});

    // Get Account
    const result = await client.send(new ScanCommand(params));
    const account = result.Items?.map((Item) => unmarshall(Item));

    console.log(`✅ getAccountByAggregateId found: ${JSON.stringify(account)}`);

    return account ? account[0] : {};
  } catch (err) {
    console.error('❌ getAccountByAggregateId error: ', err);

    return null;
  }
}

export default getAccountByAggregateId;
