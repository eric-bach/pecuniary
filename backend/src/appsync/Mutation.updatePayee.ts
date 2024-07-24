import { AppSyncIdentityCognito, Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { Payee, MutationUpdatePayeeArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationUpdatePayeeArgs>): DynamoDBUpdateItemRequest {
  console.log('🔔 UpdatePayee Request: ', ctx);

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(ctx.args.pk),
      createdAt: util.dynamodb.toDynamoDB(ctx.args.createdAt),
    },
    update: {
      expression: 'SET #name = :name, updatedAt = :updatedAt',
      expressionNames: {
        '#name': 'name',
      },
      expressionValues: {
        ':name': util.dynamodb.toDynamoDB(ctx.args.name),
        ':updatedAt': util.dynamodb.toDynamoDB(util.time.nowISO8601()),
      },
    },
    condition: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      },
    },
  };
}

export function response(ctx: Context<MutationUpdatePayeeArgs>): Payee {
  console.log('🔔 UpdatePayee Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
