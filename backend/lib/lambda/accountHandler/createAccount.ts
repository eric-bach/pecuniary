const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');

import { PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import dynamoDbCommand from './helpers/dynamoDbCommand';
import { CreateAccountInput, AccountReadModel } from '../types/Account';

async function createAccount(input: CreateAccountInput) {
  console.debug(`🕧 Create Account initialized`);

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

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved Account: ${JSON.stringify({ result: result, item: unmarshall(putItemCommandInput.Item) })}`);

    return unmarshall(putItemCommandInput.Item);
  }

  console.error(`🛑 Error saving Account:\n`, result);
  return {};
}

export default createAccount;
