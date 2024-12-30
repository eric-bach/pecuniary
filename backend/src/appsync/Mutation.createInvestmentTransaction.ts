import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { InvestmentTransaction, MutationCreateInvestmentTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateInvestmentTransactionArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateInvestmentTransaction Request: ', ctx);

  const transactionId = util.autoId();
  const datetime = util.time.nowISO8601();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`trans#${transactionId}`),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('investment-transaction'),
      accountId: util.dynamodb.toDynamoDB(ctx.args.input.accountId),
      transactionId: util.dynamodb.toDynamoDB(transactionId),
      type: util.dynamodb.toDynamoDB(ctx.args.input.type),
      transactionDate: util.dynamodb.toDynamoDB(ctx.args.input.transactionDate),
      symbol: util.dynamodb.toDynamoDB(ctx.args.input.symbol),
      shares: util.dynamodb.toDynamoDB(ctx.args.input.shares),
      price: util.dynamodb.toDynamoDB(ctx.args.input.price),
      commission: util.dynamodb.toDynamoDB(ctx.args.input.commission),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      createdAt: util.dynamodb.toDynamoDB(datetime),
      updatedAt: util.dynamodb.toDynamoDB(datetime),
    },
  };
}

export function response(ctx: Context<MutationCreateInvestmentTransactionArgs>): InvestmentTransaction {
  console.log('🔔 CreateInvestmentTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'InvestmentTransactionSavedEvent' };
}
