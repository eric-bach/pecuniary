const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

import { PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { CreateAccountInput, AccountReadModel } from '../types/Account';

async function createAccount(input: CreateAccountInput) {
  var item: AccountReadModel = {
    userId: input.userId,
    aggregateId: uuidv4(),
    entity: 'account',
    type: input.type,
    name: input.name,
    description: input.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result && result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved item to DynamoDB: ${JSON.stringify({ result: result, item: unmarshall(putItemCommandInput.Item) })}`);

    return unmarshall(putItemCommandInput.Item);
  }

  console.error(`❌ Error saving item to DynamoDB:\n`, result);
  return {};
}

async function dynamoDbCommand(command: any) {
  var result;

  try {
    var client = new DynamoDBClient({ region: process.env.REGION });
    console.debug(`DynamoDB command:\n${JSON.stringify(command)}`);
    result = await client.send(command);
    console.log(`🔔 DynamoDB result:\n${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`❌ Error with DynamoDB command:\n`, error);
    return error;
  }
}

export default createAccount;
