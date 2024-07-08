import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { UpdateBankTransactionInput } from '../../../infrastructure/graphql/api/codegen/appsync';

async function updateBankTransaction(userId: string, input: UpdateBankTransactionInput) {
  console.debug(`🕧 Update Bank Transaction initialized`);

  const updateItemCommandInput: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      pk: input.pk,
      createdAt: input.createdAt,
    }),
    UpdateExpression: 'SET transactionDate=:transactionDate, payee=:payee, category=:category, amount=:amount, updatedAt=:updatedAt',
    ExpressionAttributeValues: marshall({
      ':transactionDate': input.transactionDate,
      ':payee': input.payee,
      ':category': input.category,
      ':amount': input.amount,
      ':updatedAt': new Date().toISOString(),
      ':userId': { S: userId },
    }),
    ConditionExpression: 'userId = :userId',
  };
  var updateResult = await dynamoDbCommand(new UpdateItemCommand(updateItemCommandInput));

  if (updateResult.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', input);

    console.log(`✅ Updated Transaction: {result: ${JSON.stringify(updateResult)}, item: ${unmarshall(updateResult.Attributes)}}`);
    return unmarshall(updateResult.Attributes);
  }

  console.log(`🛑 Could not update bank transaction\n`, updateResult);
  return {};
}

export default updateBankTransaction;
