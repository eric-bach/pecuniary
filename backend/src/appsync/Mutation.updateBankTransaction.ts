import { AppSyncIdentityCognito, Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { BankTransaction, MutationUpdateBankTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationUpdateBankTransactionArgs>): DynamoDBUpdateItemRequest {
  console.log('🔔 UpdateBankTransaction Request: ', ctx);

  const updatedAt = util.time.nowISO8601();

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`trans#${ctx.args.input.transactionId}`),
    },
    update: {
      expression: 'SET transactionDate=:transactionDate, payee=:payee, category=:category, amount=:amount, updatedAt=:updatedAt',
      expressionValues: {
        accountId: util.dynamodb.toDynamoDB(ctx.args.input.accountId),
        transactionDate: util.dynamodb.toDynamoDB(ctx.args.input.transactionDate),
        payee: util.dynamodb.toDynamoDB(ctx.args.input.payee),
        category: util.dynamodb.toDynamoDB(ctx.args.input.category),
        amount: util.dynamodb.toDynamoDB(ctx.args.input.amount),
        userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
        updatedAt: util.dynamodb.toDynamoDB(updatedAt),
      },
    },
  };
}

export function response(ctx: Context<MutationUpdateBankTransactionArgs>): BankTransaction {
  console.log('🔔 UpdateBankTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'BankTransactionSavedEvent' };
}
