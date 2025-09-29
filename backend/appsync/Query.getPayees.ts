import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { GetPayeesResponse } from './api/codegen/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetPayees Request: ', ctx);

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
        ':entity': util.dynamodb.toDynamoDB('payee'),
      },
    },
  };
}

export function response(ctx: Context): GetPayeesResponse {
  console.log('🔔 GetPayees Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
