import { AppSyncIdentityCognito, Context, DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import { Account, MutationCreateAccountArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateAccountArgs>): DynamoDBPutItemRequest {
  console.log('🔔 CreateAccount Request: ', ctx);

  const accountId = util.autoId();
  const datetime = util.time.nowISO8601();

  return {
    operation: 'PutItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`acc#${accountId}`),
    },
    attributeValues: {
      entity: util.dynamodb.toDynamoDB('account'),
      accountId: util.dynamodb.toDynamoDB(accountId),
      category: util.dynamodb.toDynamoDB(ctx.args.input.category),
      type: util.dynamodb.toDynamoDB(ctx.args.input.type),
      name: util.dynamodb.toDynamoDB(ctx.args.input.name),
      balance: util.dynamodb.toDynamoDB(0),
      userId: util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      createdAt: util.dynamodb.toDynamoDB(datetime),
      updatedAt: util.dynamodb.toDynamoDB(datetime),
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
