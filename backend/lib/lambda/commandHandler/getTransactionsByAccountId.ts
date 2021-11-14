import { DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

async function getTransactionsByAccountId(accountId: string) {
  console.debug(`getTransactionsByAccountId: ${JSON.stringify(accountId)}`);

  const params: ScanCommandInput = {
    TableName: process.env.TRANSACTION_TABLE_NAME,
    ExpressionAttributeNames: {
      '#a': 'accountId',
    },
    ExpressionAttributeValues: {
      ':accountId': { S: accountId },
    },
    FilterExpression: '#a = :accountId',
  };

  try {
    console.debug('Searching for Transactions with accountId: ', accountId);
    const client = new DynamoDBClient({});

    // Get Account
    const result = await client.send(new ScanCommand(params));
    const transactions = result.Items?.map((Item) => unmarshall(Item));

    console.log(`✅ getTransactionsByAccountId found: ${JSON.stringify(transactions)}`);

    return transactions ? transactions : [];
  } catch (err) {
    console.error('❌ getTransactionsByAccountId error: ', err);

    return null;
  }
}

export default getTransactionsByAccountId;
