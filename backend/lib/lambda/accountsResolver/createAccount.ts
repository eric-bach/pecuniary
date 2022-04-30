import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
const { v4: uuidv4 } = require('uuid');

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
    createdAt: 'ACC#' + new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    console.log(`✅ Saved Account: ${JSON.stringify({ result: result, item: item })}`);

    return item;
  }

  console.error(`🛑 Error saving Account:\n`, result);
  return {};
}

export default createAccount;
