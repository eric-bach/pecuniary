import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { Account } from './types/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetAccounts Request: ', ctx);

  return {
    operation: 'Query',
    index: 'entity-gsi',
    query: {
      expression: 'entity = :entity',
      expressionValues: {
        ':entity': util.dynamodb.toDynamoDB('account'),
      },
    },
    filter: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      },
    },
  };
}

export function response(ctx: Context): Account[] {
  console.log('🔔 GetAccounts Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result.items;
}
