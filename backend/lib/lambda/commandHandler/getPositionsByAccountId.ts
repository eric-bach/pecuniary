import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

async function getPositionsByAccountId(accountId: string) {
  console.debug(`getPositionsByAccountId: ${JSON.stringify(accountId)}`);

  const params: ScanCommandInput = {
    TableName: process.env.POSITION_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'accountId',
    },
    ExpressionAttributeValues: {
      ':accountId': { S: accountId },
    },
    FilterExpression: '#a = :accountId',
  };

  try {
    console.debug('Searching for Positions with accountId: ', accountId);
    const client = new DynamoDBClient({});

    // Get Account
    const result = await client.send(new ScanCommand(params));
    const positions = result.Items?.map((Item) => unmarshall(Item));

    console.log(`✅ getPositionsByAccountId found: ${JSON.stringify(positions)}`);

    return positions ? positions : {};
  } catch (err) {
    console.error('❌ getPositionsByAccountId error: ', err);

    return null;
  }
}

export default getPositionsByAccountId;
