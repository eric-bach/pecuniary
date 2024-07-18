import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { Category, MutationCreateCategoryArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateCategoryArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateCategory Request: ', ctx);

  const categoryId = util.autoId();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`cat#${categoryId}`),
      createdAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('category'),
      name: util.dynamodb.toDynamoDB(ctx.args.name),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      updatedAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
  };
}

export function response(ctx: Context<MutationCreateCategoryArgs>): Category {
  console.log('🔔 CreateCategory Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
