import { AppSyncIdentityCognito, Context, DynamoDBUpdateItemRequest, util } from '@aws-appsync/utils';
import { Account, MutationUpdateAccountArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationUpdateAccountArgs>): DynamoDBUpdateItemRequest {
  console.log('🔔 UpdateAccount Request: ', ctx);

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(`acc#${ctx.args.input.accountId}`),
    },
    update: {
      expression: 'SET #name = :name, category = :category, #type = :type, updatedAt = :updatedAt',
      expressionNames: {
        '#name': 'name',
        '#type': 'type',
      },
      expressionValues: {
        ':name': util.dynamodb.toDynamoDB(ctx.args.input.name),
        ':category': util.dynamodb.toDynamoDB(ctx.args.input.category),
        ':type': util.dynamodb.toDynamoDB(ctx.args.input.type),
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

export function response(ctx: Context<MutationUpdateAccountArgs>): Account {
  console.log('🔔 UpdateAccount Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
