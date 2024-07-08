import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { BankTransaction, CreateBankTransactionInput } from '../../../infrastructure/graphql/api/codegen/appsync';
import { v4 as uuidv4 } from 'uuid';

async function createBankTransaction(userId: string, input: CreateBankTransactionInput) {
  console.debug(`🕧 Create Bank Transaction initialized`);

  var item: BankTransaction = {
    pk: `trans#${input.accountId}`,
    createdAt: new Date().toISOString(),
    entity: 'bank-transaction',
    accountId: input.accountId,
    transactionId: uuidv4(),
    transactionDate: input.transactionDate,
    payee: input.payee,
    category: input.category,
    amount: input.amount,
    userId: userId,
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', { ...input, userId: userId });

    console.log(`✅ Saved Transaction: ${JSON.stringify({ result: result, item: item })}`);
    return item;
  }

  console.error(`🛑 Error saving bank transaction:\n`, result);
  return {};
}

export default createBankTransaction;
