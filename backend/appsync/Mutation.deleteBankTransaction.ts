import { Context, DynamoDBDeleteItemRequest, util } from '@aws-appsync/utils';
import { DeleteTransaction, MutationDeleteBankTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationDeleteBankTransactionArgs>): DynamoDBDeleteItemRequest {
  console.log('🔔 DeleteBankTransaction Request: ', ctx);

  return {
    operation: 'DeleteItem',
    key: {
      pk: util.dynamodb.toDynamoDB(ctx.args.input.pk),
    },
  };
}

export function response(ctx: Context<MutationDeleteBankTransactionArgs>): DeleteTransaction {
  console.log('🔔 DeleteBankTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'BankTransactionSavedEvent' };
}
