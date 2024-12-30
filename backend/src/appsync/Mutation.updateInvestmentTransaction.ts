import { AppSyncIdentityCognito, Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { InvestmentTransaction, MutationUpdateInvestmentTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationUpdateInvestmentTransactionArgs>): DynamoDBUpdateItemRequest {
  console.log('🔔 UpdateInvestmentTransaction Request: ', ctx);

  const updatedAt = util.time.nowISO8601();

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`trans#${ctx.args.input.transactionId}`),
    },
    update: {
      expression:
        'SET #type=:type, transactionDate=:transactionDate, symbol=:symbol, shares=:shares, price=:price, commission=:commission, updatedAt=:updatedAt',
      expressionValues: {
        accountId: util.dynamodb.toDynamoDB(ctx.args.input.accountId),
        type: util.dynamodb.toDynamoDB(ctx.args.input.type),
        transactionDate: util.dynamodb.toDynamoDB(ctx.args.input.transactionDate),
        symbol: util.dynamodb.toDynamoDB(ctx.args.input.symbol),
        shares: util.dynamodb.toDynamoDB(ctx.args.input.shares),
        price: util.dynamodb.toDynamoDB(ctx.args.input.price),
        commission: util.dynamodb.toDynamoDB(ctx.args.input.commission),
        userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
        updatedAt: util.dynamodb.toDynamoDB(updatedAt),
      },
    },
  };
}

export function response(ctx: Context<MutationUpdateInvestmentTransactionArgs>): InvestmentTransaction {
  console.log('🔔 UpdateInvestmentTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'InvestmentTransactionSavedEvent' };
}
