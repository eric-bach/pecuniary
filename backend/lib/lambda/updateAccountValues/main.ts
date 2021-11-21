import { AccountReadModel } from './../../../../client/src/pages/Account/types/Account.d';
import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, UpdateItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

type Detail = {
  id: string;
  version: number;
  bookValue: number;
  marketValue: number;
};

exports.handler = async (event: EventBridgeEvent<string, Detail>) => {
  var eventString = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;

  // Get account matching account id
  var account: AccountReadModel = await getAccountAsync(detail.id);

  // Update Account values
  await updateAccountValuesAsync(account, detail);
};

async function getAccountAsync(accountId: string): Promise<AccountReadModel> {
  const params = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({ id: accountId }),
  };

  try {
    console.debug('Looking up Account: ', accountId);

    const client = new DynamoDBClient({});
    const result = await client.send(new GetItemCommand(params));

    if (result.Item) {
      return unmarshall(result.Item);
    } else {
      console.log(`🔔 Could not find Account with matching Id: ${accountId}`);
    }
  } catch (e) {
    console.log(`❌ Error looking for Account: ${e}`);
  }

  return {} as AccountReadModel;
}

async function updateAccountValuesAsync(account: AccountReadModel, detail: Detail) {
  const updateItemCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: detail.id,
    }),
    UpdateExpression: 'SET version=:version, bookValue=:bookValue, marketValue=:marketValue',
    ExpressionAttributeValues: marshall({
      ':version': detail.version + 1,
      ':bookValue': account.bookValue + detail.bookValue,
      ':marketValue': account.marketValue + detail.marketValue,
    }),
    ReturnValues: 'ALL_NEW',
  };
  const command = new UpdateItemCommand(updateItemCommandInput);

  var result;
  try {
    var client = new DynamoDBClient({ region: process.env.REGION });

    console.log('🔔 Updating DynamoDB item');
    console.debug(`DynamoDB item: ${JSON.stringify(updateItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with updating DynamoDB item`, error);
  }

  console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(result)}`);
}
