import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { CreateInvestmentTransactionInput, InvestmentTransaction } from '../../appsync/api/codegen/appsync';
import { v4 as uuidv4 } from 'uuid';

async function createTransaction(userId: string, input: CreateInvestmentTransactionInput) {
  console.debug(`🕧 Create Investment Transaction initialized`);

  const transactionId = uuidv4();
  const datetime = new Date().toISOString();

  const item: InvestmentTransaction = {
    pk: `trans#${transactionId}`,
    entity: 'investment-transaction',
    accountId: input.accountId,
    transactionId: transactionId,
    type: input.type,
    transactionDate: input.transactionDate,
    symbol: input.symbol,
    shares: input.shares,
    price: input.price,
    commission: input.commission,
    userId: userId,
    createdAt: datetime,
    updatedAt: datetime,
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  const result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', { ...input, userId: userId });

    console.log(`✅ Saved Transaction: ${JSON.stringify({ result: result, item: item })}`);
    return item;
  }

  console.error(`🛑 Error saving investment transaction:\n`, result);
  return {};
}

export default createTransaction;
