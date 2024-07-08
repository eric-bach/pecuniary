import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { CreateInvestmentTransactionInput, InvestmentTransaction } from '../../../infrastructure/graphql/api/codegen/appsync';

async function createTransaction(userId: string, input: CreateInvestmentTransactionInput) {
  console.debug(`🕧 Create Investment Transaction initialized`);

  var item: InvestmentTransaction = {
    pk: `trans#${input.accountId}`,
    createdAt: new Date().toISOString(),
    userId: userId,
    entity: 'transaction',
    accountId: input.accountId,
    type: input.type,
    transactionDate: input.transactionDate,
    symbol: input.symbol,
    shares: input.shares,
    price: input.price,
    commission: input.commission,
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

  console.error(`🛑 Error saving investment transaction:\n`, result);
  return {};
}

export default createTransaction;
