import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

type Detail = {
  id: string;
  aggregateId: string;
  version: number;
  userId: string;
};
type AccountType = {
  id: string;
  name: string;
  description: string;
};
type Account = {
  id: string;
  name: string;
  description: string;
  bookValue: number;
  marketValue: number;
  accountType: AccountType;
};

exports.handler = async (event: EventBridgeEvent<string, Account>) => {
  var eventString = JSON.stringify(event);
  console.debug(`Received event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // Update Account
  await updateAccountAsync(detail, data);
};

async function updateAccountAsync(detail: Detail, data: Account) {
  const updateItemCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: data.id,
    }),
    UpdateExpression:
      'SET version=:version, #name=:name, description=:description, bookValue=:bookValue, marketValue=:marketValue, accountType=:accountType',
    ExpressionAttributeValues: marshall({
      ':version': detail.version,
      ':name': data.name,
      ':description': data.description,
      ':bookValue': data.bookValue,
      ':marketValue': data.marketValue,
      ':accountType': data.accountType,
    }),
    ExpressionAttributeNames: {
      '#name': 'name',
    },
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
