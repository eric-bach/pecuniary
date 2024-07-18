import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { Payee, MutationCreatePayeeArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreatePayeeArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreatePayee Request: ', ctx);

  const categoryId = util.autoId();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`cat#${categoryId}`),
      createdAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('payee'),
      name: util.dynamodb.toDynamoDB(ctx.args.name),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      updatedAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
  };
}

export function response(ctx: Context<MutationCreatePayeeArgs>): Payee {
  console.log('🔔 CreatePayee Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
