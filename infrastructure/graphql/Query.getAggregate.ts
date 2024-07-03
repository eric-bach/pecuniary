import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { Aggregates, QueryGetAggregateArgs } from './api/codegen/appsync';

export function request(ctx: Context<QueryGetAggregateArgs>): DynamoDBQueryRequest {
  console.log('🔔 GetAggregate Request: ', ctx);

  const { accountId, type } = ctx.args;

  return {
    operation: 'Query',
    index: 'accountId-gsi',
    query: {
      expression: 'accountId = :accountId',
      expressionValues: {
        ':accountId': util.dynamodb.toDynamoDB(accountId),
      },
    },
    filter: type
      ? {
          expression: 'userId = :userId AND #type = :type',
          expressionNames: {
            '#type': 'type',
          },
          expressionValues: {
            ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
            ':type': util.dynamodb.toDynamoDB(ctx.args.type),
          },
        }
      : {
          expression: 'userId = :userId',
          expressionValues: {
            ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
          },
        },
  };
}

export function response(ctx: Context<QueryGetAggregateArgs>): Aggregates {
  console.log('🔔 GetAggregate Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
