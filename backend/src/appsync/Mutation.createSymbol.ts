import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { MutationCreateSymbolArgs, Symbol } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateSymbolArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateSymbol Request: ', ctx);

  const categoryId = util.autoId();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`cat#${categoryId}`),
      createdAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('symbol'),
      name: util.dynamodb.toDynamoDB(ctx.args.name),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      updatedAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
  };
}

export function response(ctx: Context<MutationCreateSymbolArgs>): Symbol {
  console.log('🔔 CreateSymbol Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
