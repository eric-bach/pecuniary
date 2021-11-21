import { EventBridgeEvent } from 'aws-lambda';
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

import { EventBridgeDetail, CreateAccountData, CreateEvent } from './types/account';

exports.handler = async (event: EventBridgeEvent<string, CreateAccountData>) => {
  const eventString: string = JSON.stringify(event);
  console.debug(`EventBridge event: ${eventString}`);

  const detail: EventBridgeDetail = JSON.parse(eventString).detail;
  const data: CreateAccountData = JSON.parse(detail.data);

  // Create Account
  await createAccountAsync(detail, data);
};

async function createAccountAsync(detail: EventBridgeDetail, data: CreateAccountData) {
  var item: CreateEvent = {
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
