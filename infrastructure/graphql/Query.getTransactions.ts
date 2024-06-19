import { AppSyncIdentityCognito, Context, DynamoDBQueryRequest, util } from '@aws-appsync/utils';
import { GetTransactionsResponse } from './api/codegen/appsync';

export function request(ctx: Context): DynamoDBQueryRequest {
  console.log('🔔 GetTransactions Request: ', ctx);

  return {
    operation: 'Query',
    index: 'accountId-gsi',
    query: {
      expression: 'accountId = :accountId',
      expressionValues: {
        ':accountId': util.dynamodb.toDynamoDB(ctx.args.accountId),
      },
    },
    // TODO: Do not limit until pagination is implemented
    //limit: 10,
    nextToken: ctx.args.lastEvaluatedKey,
    filter: {
      expression: 'userId = :userId AND entity = :entity',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB((ctx.identity as AppSyncIdentityCognito).username),
        ':entity': util.dynamodb.toDynamoDB('transaction'),
      },
    },
  };
}

export function response(ctx: Context): GetTransactionsResponse {
  console.log('🔔 GetTransactions Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
