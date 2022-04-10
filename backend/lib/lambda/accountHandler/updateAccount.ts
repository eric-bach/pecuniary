const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

import { unmarshall } from '@aws-sdk/util-dynamodb';
import { UpdateAccountInput } from '../types/Account';

async function updateAccount(input: UpdateAccountInput) {
  const updateItemCommandInput = {
    TableName: process.env.ACCOUNT_TABLE_NAME,
    Key: marshall({
      id: input.id,
    }),
    UpdateExpression:
      'SET version=:version, #name=:name, description=:description, bookValue=:bookValue, marketValue=:marketValue, accountType=:accountType',
    ExpressionAttributeValues: marshall({
      ':version': input.version + 1,
      ':name': input.name,
      ':description': input.description,
      ':bookValue': input.bookValue,
      ':marketValue': input.marketValue,
      ':accountType': { id: input.accountTypeId, name: input.accountTypeName, description: input.accountTypeDescription },
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
    return error;
  }

  console.log(`✅ Updated item in DynamoDB: ${JSON.stringify(result)}`);
  return unmarshall(result.Attributes);
}

export default updateAccount;
