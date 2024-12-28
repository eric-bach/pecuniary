import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { GetPositionsResponse } from './api/codegen/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetPositions Request: ', ctx);

  return {
    operation: 'Query',
    index: 'userId-gsi',
    query: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
      },
    },
    nextToken: ctx.arguments.lastEvaluatedKey,
    filter: {
      expression: 'accountId = :accountId AND entity = :entity',
      expressionValues: {
        ':accountId': util.dynamodb.toDynamoDB(ctx.args.accountId),
        ':entity': util.dynamodb.toDynamoDB('position'),
      },
    },
  };
}

export function response(ctx: Context): GetPositionsResponse {
  console.log('🔔 GetPositions Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
