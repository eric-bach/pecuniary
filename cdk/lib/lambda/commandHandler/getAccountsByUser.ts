import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

async function getAccountsByUser(userId: string) {
  console.debug(`getAccountsByUser: ${JSON.stringify(userId)}`);

  const params: ScanCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    ExpressionAttributeNames: {
      '#u': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': { S: userId },
    },
    FilterExpression: '#u = :userId',
  };

  try {
    console.debug('Searching for Accounts');
    const client = new DynamoDBClient({});

    // Get Accounts
    const result = await client.send(new ScanCommand(params));
    const accounts = result.Items?.map((Item) => unmarshall(Item));

    console.log(`✅ getAccountsByUser found: ${JSON.stringify(accounts)}`);

    return accounts;
  } catch (err) {
    console.error('❌ getAccountsByUser error: ', err);

    return null;
  }
}

export default getAccountsByUser;
