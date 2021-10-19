import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

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
  console.debug(`EventBridge event: ${eventString}`);

  var detail = JSON.parse(eventString).detail;
  var data = JSON.parse(detail.data);

  // Create Account
  await createAccountAsync(detail, data);
};

async function createAccountAsync(detail: Detail, data: Account) {
  var item = {
    id: uuidv4(),
    aggregateId: detail.aggregateId,
    version: detail.version,
    userId: detail.userId,
    name: data.name,
    description: data.description,
    bookValue: data.bookValue,
    marketValue: data.marketValue,
    accountType: {
      id: data.accountType.id,
      name: data.accountType.name,
      description: data.accountType.description,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Item: marshall(item),
  };
  const command = new PutItemCommand(putItemCommandInput);

  var result;
  try {
    var client = new DynamoDBClient({ region: process.env.REGION });

    console.log('🔔 Saving item to DynamoDB');
    console.debug(`DynamoDB item: ${JSON.stringify(putItemCommandInput)}`);

    result = await client.send(command);
  } catch (error) {
    console.error(`❌ Error with saving DynamoDB item`, error);
  }

  console.log(`✅ Saved item to DynamoDB: ${JSON.stringify(result)}`);
}
