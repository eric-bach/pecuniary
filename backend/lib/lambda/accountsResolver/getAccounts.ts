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
        var positionsGrouped = groupByCurrency(positions);
        console.log('🔔 Positions Grouped by Currency: ', JSON.stringify(positionsGrouped));

        // Sum book/marketValue for grouped positions
        var currencies: any = [];
        var cur: any, pos: any;
        for ([cur, pos] of Object.entries(positionsGrouped)) {
          console.log('🔔 Currency: ', cur);
          console.log('🔔 Positions: ', JSON.stringify(pos));

          let bookValue = 0;
          let marketValue = 0;
          pos.forEach((p: any) => {
            bookValue += p.bookValue;
            marketValue += p.marketValue;
          });

          var currency: any = { currency: cur, bookValue, marketValue };
          console.log('ℹ️ Currency: ', JSON.stringify(currency));
          currencies.push(currency);
        }

        account.currencies = currencies;
      }
    }

    console.log(`✅ Found Accounts: ${JSON.stringify(accounts)}`);
    return accounts;
  }

  console.log(`🛑 Could not find any Account`);
  return [];
}

function groupByCurrency(items: any[]) {
  var result = items.reduce(function (r: any[], a: any) {
    r[a.currency] = r[a.currency] || [];
    r[a.currency].push(a);
    return r;
  }, Object.create(null));

  return result;
}

export default getAccounts;
