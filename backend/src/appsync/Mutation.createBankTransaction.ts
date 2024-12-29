import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { BankTransaction, MutationCreateBankTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateBankTransactionArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateBankTransaction Request: ', ctx);

  const transactionId = util.autoId();
  const datetime = util.time.nowISO8601();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`trans#${transactionId}`),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('bank-transaction'),
      accountId: util.dynamodb.toDynamoDB(ctx.args.input.accountId),
      transactionId: util.dynamodb.toDynamoDB(transactionId),
      transactionDate: util.dynamodb.toDynamoDB(ctx.args.input.transactionDate),
      payee: util.dynamodb.toDynamoDB(ctx.args.input.payee),
      category: util.dynamodb.toDynamoDB(ctx.args.input.category),
      amount: util.dynamodb.toDynamoDB(ctx.args.input.amount),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      createdAt: util.dynamodb.toDynamoDB(datetime),
      updatedAt: util.dynamodb.toDynamoDB(datetime),
    },
  };
}

export function response(ctx: Context<MutationCreateBankTransactionArgs>): BankTransaction {
  console.log('🔔 CreateBankTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'BankTransactionSavedEvent' };
}
