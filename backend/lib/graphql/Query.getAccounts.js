import { util } from '@aws-appsync/utils';

export function request(ctx) {
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
        ':userId': util.dynamodb.toDynamoDB(ctx.identity.username),
      },
    },
  };
}

export function response(ctx) {
  console.log('🔔 GetAccounts Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result.items;
}
