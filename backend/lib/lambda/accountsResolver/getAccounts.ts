import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getAccounts(userId: string) {
  console.debug(`🕧 Get Accounts Initialized`);

  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'entity-lsi',
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

    var accounts: any = [];

    // Cannot use forEach for following async method
    for (const item of result.Items) {
      var account = unmarshall(item);
      console.log('ℹ️ Looking up Positions for Account: ', account);

      const positionQueryCommandInput: QueryCommandInput = {
        TableName: process.env.DATA_TABLE_NAME,
        IndexName: 'aggregateId-lsi',
        //TODO How to handle more than 100?
        Limit: 100,
        KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
        FilterExpression: 'entity = :v3',
        ExpressionAttributeValues: {
          ':v1': { S: account.userId },
          ':v2': { S: account.aggregateId },
          ':v3': { S: 'position' },
        },
      };
      var positionResult = await dynamoDbCommand(new QueryCommand(positionQueryCommandInput));

      if (positionResult.$metadata.httpStatusCode === 200) {
        console.log(`🔔 Found Positions: ${JSON.stringify(positionResult)}`);

        // Group positions by currency
        var positions: any = [];
        positionResult.Items.forEach(async (p: any) => {
          positions.push(unmarshall(p));
        });
        var positionsGrouped = groupByCurrency(positions);
        console.log('🔔🔔🔔 ', JSON.stringify(positionsGrouped));

        // Sum book/marketValue for grouped positions
        var currencies: any = [];
        for (var [key, value] of Object.entries(positionsGrouped)) {
          console.log('🔔🔔🔔 ', key);
          console.log('🔔🔔🔔 ', JSON.stringify(value));

          let bookValue = 0;
          let marketValue = 0;
          let values: any;
          values = value;
          values.forEach((v: any) => {
            bookValue += v.bookValue;
            marketValue += v.marketValue;
          });

          var currency: any = { currency: key, bookValue: bookValue, marketValue: marketValue };
          console.log(currency);
          currencies.push(currency);
        }

        account.currencies = currencies;

        /* 
        // OLD WAY OF AGGREGATING BOOK/MARKET VALUE
        let bookValue = 0;
        let marketValue = 0;

        positionResult.Items.forEach(async (p: any) => {
          var position = unmarshall(p);
          console.log('ℹ️ Updating book/market value for Position: ', position);

          bookValue += position.bookValue;
          marketValue += position.marketValue;
        });

        // Update Account Book Value
        account.bookValue = bookValue;
        account.marketValue = marketValue;
        */
      }

      console.log(`🔔 Updated book/market values for Account: ${JSON.stringify(account)}`);
      accounts.push(account);
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
