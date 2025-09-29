import { AppSyncIdentityCognito, Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { Category, MutationUpdateCategoryArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationUpdateCategoryArgs>): DynamoDBUpdateItemRequest {
  console.log('🔔 UpdateCategory Request: ', ctx);

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(ctx.args.pk),
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

export function response(ctx: Context<MutationUpdateCategoryArgs>): Category {
  console.log('🔔 UpdateCategory Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
