import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { LastEvaluatedKey } from '../types/Account';
import dynamoDbCommand from './helpers/dynamoDbCommand';

async function getAccounts(userId: string, aggregateId: string, lastEvaluatedKey: LastEvaluatedKey) {
  console.debug(`🕧 Get Accounts Initialized`);

  let queryCommandInput: QueryCommandInput;
  if (aggregateId) {
    // Get a single account
    queryCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      Limit: 1,
      IndexName: 'aggregateId-lsi',
      KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
      ExpressionAttributeValues: {
        ':v1': { S: userId },
        ':v2': { S: aggregateId },
      },
    };
  } else {
    queryCommandInput = {
      TableName: process.env.DATA_TABLE_NAME,
      //TODO TEMP Limit to 10
      Limit: 10,
      KeyConditionExpression: 'userId = :v1 AND begins_with(sk, :v2)',
      ExpressionAttributeValues: {
        ':v1': { S: userId },
        ':v2': { S: 'ACC#' },
      },
    };
  }
  lastEvaluatedKey ? (queryCommandInput.ExclusiveStartKey = marshall(lastEvaluatedKey)) : lastEvaluatedKey;

  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  if (result && result.$metadata.httpStatusCode === 200) {
    console.log(`🔔 Found Accounts and Positions: ${JSON.stringify(result)}`);

    // Check for LastEvaluatedKey
    var lastEvalKey;
    if (result.LastEvaluatedKey) {
      let lek = unmarshall(result.LastEvaluatedKey);
      lastEvalKey = lek ? lek : '';
    }

    // Unmarshall results
    var results: any = [];
    for (const item of result.Items) {
      console.debug('ℹ️ Item: ', JSON.stringify(item));

      var uItem = unmarshall(item);
      results.push(uItem);
    }

    // Get Accounts
    var accounts = results.filter((x: any) => x.entity === 'account');
    console.debug('ℹ️ Accounts: ', JSON.stringify(accounts));

    for (const account of accounts) {
      account.currencies = [];

      // var positions = results.filter((x: any) => x.entity === 'position' && x.aggregateId === account.aggregateId);
      var positions = await getPositions(userId, account.aggregateId);
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

    let res = { items: accounts, lastEvaluatedKey: lastEvalKey };
    console.log(`✅ Found Accounts: ${JSON.stringify(res)}`);
    return res;
  }

  console.log(`🛑 Could not find any Account`);
  return [];
}

async function getPositions(userId: string, aggregateId: string) {
  const queryCommandInput: QueryCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'aggregateId-lsi',
    KeyConditionExpression: 'userId = :v1 AND aggregateId = :v2',
    FilterExpression: 'begins_with(sk, :v3)',
    ExpressionAttributeValues: {
      ':v1': { S: userId },
      ':v2': { S: aggregateId },
      ':v3': { S: 'ACCPOS#' },
    },
  };

  var result = await dynamoDbCommand(new QueryCommand(queryCommandInput));

  var results: any = [];
  if (result && result.$metadata.httpStatusCode === 200) {
    // Unmarshall results
    for (const item of result.Items) {
      console.debug('ℹ️ Item: ', JSON.stringify(item));

      var uItem = unmarshall(item);

      results.push(uItem);
    }
  }

  return results;
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
