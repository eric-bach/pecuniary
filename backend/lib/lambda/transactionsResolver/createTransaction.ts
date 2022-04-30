import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { CreateTransactionInput, TransactionReadModel } from '../types/Transaction';

async function createTransaction(input: CreateTransactionInput) {
  console.debug(`🕧 Create Transaction initialized`);

  var item: TransactionReadModel = {
    userId: input.userId,
    aggregateId: input.aggregateId,
    entity: 'transaction',
    type: input.type,
    transactionDate: input.transactionDate,
    symbol: input.symbol,
    shares: input.shares,
    price: input.price,
    commission: input.commission,
    createdAt: 'TRANS#' + new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput: PutItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', input);

    console.log(`✅ Saved Transaction: ${JSON.stringify({ result: result, item: item })}`);
    return item;
  }

  console.error(`🛑 Error saving Transaction:\n`, result);
  return {};
}

export default createTransaction;
