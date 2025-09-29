import { Context, DynamoDBDeleteItemRequest, util } from '@aws-appsync/utils';
import { DeleteTransaction, MutationDeleteInvestmentTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationDeleteInvestmentTransactionArgs>): DynamoDBDeleteItemRequest {
  console.log('🔔 DeleteInvestmentTransaction Request: ', ctx);

  return {
    operation: 'DeleteItem',
    key: {
      pk: util.dynamodb.toDynamoDB(ctx.args.input.pk),
    },
  };
}

export function response(ctx: Context<MutationDeleteInvestmentTransactionArgs>): DeleteTransaction {
  console.log('🔔 DeleteInvestmentTransaction Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { ...ctx.result, detailType: 'InvestmentTransactionSavedEvent' };
}
