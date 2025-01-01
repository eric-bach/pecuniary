import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { MutationCreateSymbolArgs, Symbol } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateSymbolArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateSymbol Request: ', ctx);

  const datetime = util.time.nowISO8601();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`symb#${ctx.args.name}`),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('symbol'),
      name: util.dynamodb.toDynamoDB(ctx.args.name),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      createdAt: util.dynamodb.toDynamoDB(datetime),
      updatedAt: util.dynamodb.toDynamoDB(datetime),
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
