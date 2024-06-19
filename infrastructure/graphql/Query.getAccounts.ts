import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { GetAccountsResponse } from './api/codegen/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetAccounts Request: ', ctx);

  return {
    operation: 'Query',
    index: 'userId-gsi',
    query: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      },
    },
    // TODO: Do not limit until pagination is implemented
    //limit: 10,
    nextToken: ctx.arguments.lastEvaluatedKey,
    filter: {
      expression: 'entity = :entity',
      expressionValues: {
        ':entity': util.dynamodb.toDynamoDB('account'),
      },
    },
  };
}

export function response(ctx: Context): GetAccountsResponse {
  console.log('🔔 GetAccounts Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
