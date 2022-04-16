const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

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
    exchange: input.exchange,
    currency: input.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const putItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Item: marshall(item),
  };
  let result = await dynamoDbCommand(new PutItemCommand(putItemCommandInput));

  if (result.$metadata.httpStatusCode === 200) {
    // Publish event to update positions
    await publishEventAsync('TransactionSavedEvent', input);

    console.log(`✅ Saved Transaction: ${JSON.stringify({ result: result, item: unmarshall(putItemCommandInput.Item) })}`);
    return unmarshall(putItemCommandInput.Item);
  }

  console.error(`🛑 Error saving Transaction:\n`, result);
  return {};
}

export default createTransaction;
