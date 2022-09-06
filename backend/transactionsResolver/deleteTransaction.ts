const { DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { DeleteItemCommandInput } from '@aws-sdk/client-dynamodb';
import { DeleteTransactionInput } from '../types/Transaction';

async function deleteTransaction(input: DeleteTransactionInput) {
  console.debug(`🕧 Delete Transaction initialized`);

  // Delete Transaction
  const deleteItemCommandInput: DeleteItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      userId: input.userId,
      sk: input.sk,
    }),
  };
  let result = await dynamoDbCommand(new DeleteItemCommand(deleteItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', input);

    console.log(`✅ Deleted Transaction: { result: ${result}, item: ${input} }`);
    return input;
  }

  console.log('🛑 Could not delete Transaction', result);
  return {};
}

export default deleteTransaction;
