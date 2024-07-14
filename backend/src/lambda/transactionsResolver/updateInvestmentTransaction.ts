import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import dynamoDbCommand from './helpers/dynamoDbCommand';
import publishEventAsync from './helpers/eventBridge';
import { UpdateInvestmentTransactionInput } from '../../appsync/api/codegen/appsync';

async function updateInvestmentTransaction(userId: string, input: UpdateInvestmentTransactionInput) {
  console.debug(`🕧 Update Investment Transaction initialized`);

  const updatedAt = new Date().toISOString();

  const updateItemCommandInput: UpdateItemCommandInput = {
    TableName: process.env.DATA_TABLE_NAME,
    Key: marshall({
      pk: input.pk,
      createdAt: input.createdAt,
    }),
    UpdateExpression:
      'SET #type=:type, transactionDate=:transactionDate, symbol=:symbol, shares=:shares, price=:price, commission=:commission, updatedAt=:updatedAt',
    ExpressionAttributeValues: marshall({
      ':type': input.type,
      ':transactionDate': input.transactionDate,
      ':symbol': input.symbol,
      ':shares': input.shares,
      ':price': input.price,
      ':commission': input.commission,
      ':userId': userId,
      ':updatedAt': updatedAt,
    }),
    ExpressionAttributeNames: {
      '#type': 'type',
    },
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
      accountId: input.pk.split('#')[1],
      updatedAt,
    };
  }

  console.log(`🛑 Could not update investment transaction\n`, updateResult);
  return {};
}

export default updateInvestmentTransaction;
