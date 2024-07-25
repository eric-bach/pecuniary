import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { UpdateBankTransactionInput } from '../../appsync/api/codegen/appsync';

async function updateBankTransaction(userId: string, input: UpdateBankTransactionInput) {
  console.debug(`🕧 Update Bank Transaction initialized`);

  const updatedAt = new Date().toISOString();

  const updateItemCommandInput: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      pk: `trans#${input.transactionId}`,
    }),
    UpdateExpression: 'SET transactionDate=:transactionDate, payee=:payee, category=:category, amount=:amount, updatedAt=:updatedAt',
    ExpressionAttributeValues: marshall({
      ':transactionDate': input.transactionDate,
      ':payee': input.payee,
      ':category': input.category,
      ':amount': input.amount,
      ':userId': userId,
      ':updatedAt': updatedAt,
    }),
    ConditionExpression: 'userId = :userId',
  };
  const updateResult = await dynamoDbCommand(new UpdateItemCommand(updateItemCommandInput));

  if (updateResult.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', input);

    // console.log(`✅ Updated Transaction: {result: ${JSON.stringify(updateResult)}, item: ${unmarshall(updateResult.Attributes)}}`);
    // return unmarshall(updateResult.Attributes);
    console.log(`✅ Updated Transaction: {result: ${JSON.stringify(updateResult)}`);
    return {
      ...input,
      updatedAt,
    };
  }

  console.log(`🛑 Could not update bank transaction\n`, updateResult);
  return {};
}

export default updateBankTransaction;
