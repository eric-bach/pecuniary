import { util } from '@aws-appsync/utils';

export function request(ctx) {
  console.log('🔔 GetAccountDetail Request: ', ctx);

  const { accountId } = ctx.args;

  return {
    version: '2017-02-28',
    operation: 'Query',
    index: 'accountId-gsi',
    query: {
      expression: 'accountId = :accountId',
      expressionValues: {
        ':accountId': util.dynamodb.toDynamoDB(accountId),
      },
    },
  };
}

export function response(ctx) {
  console.log('🔔 GetAccountDetail Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result.items;
}
