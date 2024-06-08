import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { Account, MutationCreateAccountArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateAccountArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateAccount Request: ', ctx);

  const accountId = util.autoId();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`acc#${accountId}`),
      createdAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
    attributeValues: {
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      entity: util.dynamodb.toDynamoDB('account'),
      accountId: util.dynamodb.toDynamoDB(accountId),
      type: util.dynamodb.toDynamoDB(ctx.args.input.type),
      name: util.dynamodb.toDynamoDB(ctx.args.input.name),
      updatedAt: util.dynamodb.toDynamoDB(util.time.nowISO8601()),
    },
  };
}

export function response(ctx: Context<MutationCreateAccountArgs>): Account {
  console.log('🔔 CreateAccount Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
