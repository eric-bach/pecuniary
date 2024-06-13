import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { GetPositionsResponse } from './api/codegen/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetPositions Request: ', ctx);

  return {
    operation: 'Query',
    index: 'userId-gsi',
    query: {
      expression: 'userId = :userId AND begins_with(pk, :entity)',
      expressionValues: {
        ':entity': util.dynamodb.toDynamoDB('account'),
        ':v2': { S: 'accpos' },
      },
    },
    nextToken: ctx.arguments.lastEvaluatedKey,
    filter: {
      expression: 'aggregateId = :aggregateId AND userId = :userId',
      expressionValues: {
        ':aggregateId': util.dynamodb.toDynamoDB(ctx.args.aggregateId),
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
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
