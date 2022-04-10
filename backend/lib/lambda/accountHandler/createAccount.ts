const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

import { CreateAccountInput, AccountReadModel } from '../types/Account';

async function createAccount(input: CreateAccountInput) {
  var item: AccountReadModel = {
    id: uuidv4(),
    aggregateId: uuidv4(),
    version: 1,
    userId: input.userId,
    name: input.name,
    description: input.description,
    bookValue: 0,
    marketValue: 0,
    accountType: {
      id: input.accountTypeId,
      name: input.accountTypeName,
      description: input.accountTypeDescription,
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
    console.error(`❌ Error with saving DynamoDB item\n`, error);
    return error;
  }

  console.log(`✅ Saved item to DynamoDB: ${JSON.stringify({ result: result, item: unmarshall(putItemCommandInput.Item) })}`);
  return unmarshall(putItemCommandInput.Item);
}

export default createAccount;
