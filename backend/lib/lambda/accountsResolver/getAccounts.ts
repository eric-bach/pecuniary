import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getAccounts(userId: string) {
  console.debug(`🕧 Get Accounts Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    //TODO How to handle more than 100?
    Limit: 100,
    KeyConditionExpression: 'userId = :v1 AND begins_with(sk, :v2)',
    ExpressionAttributeValues: {
      ':v1': { S: userId },
      ':v2': { S: 'ACC' },
    },
  };
  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result && result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Accounts and Positions: ${JSON.stringify(result)}`);

    // Unmarshall results
    var results: any = [];
    for (const item of result.Items) {
      console.debug('ℹ️ Item: ', JSON.stringify(item));
      results.push(unmarshall(item));
    }
    // Get Accounts
    var accounts = results.filter((x: any) => x.entity === 'account');
    console.debug('ℹ️ Accounts: ', JSON.stringify(accounts));

    for (const account of accounts) {
      account.currencies = [];

      var positions = results.filter((x: any) => x.entity === 'position' && x.aggregateId === account.aggregateId);
      console.debug('ℹ️ Positions: ', JSON.stringify(positions));

      if (positions.length > 0) {
        let currency = '';
        let bookValue = 0;
        let marketValue = 0;

        for (const position of positions) {
          currency = position.currency;
          bookValue += position.bookValue;
          marketValue += position.marketValue;
        }

        // Add Position to Account
        var p = { currency, bookValue, marketValue };
        console.log('ℹ️ Currency: ', JSON.stringify(p));
        account.currencies.push(p);
      }
    }

    console.log(`✅ Found Accounts: ${JSON.stringify(accounts)}`);
    return accounts;
  }

  console.log(`🛑 Could not find any Account`);
  return [];
}

export default getAccounts;
