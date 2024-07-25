import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { Payee, MutationCreatePayeeArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreatePayeeArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreatePayee Request: ', ctx);

  const payeeId = util.autoId();
  const datetime = util.time.nowISO8601();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`pay#${payeeId}`),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('payee'),
      name: util.dynamodb.toDynamoDB(ctx.args.name),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      createdAt: util.dynamodb.toDynamoDB(datetime),
      updatedAt: util.dynamodb.toDynamoDB(datetime),
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
