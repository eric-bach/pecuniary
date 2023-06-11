import { util } from '@aws-appsync/utils';

export function request(ctx) {
  console.log('🔔 GetAccount Request: ', ctx);

  const { accountId } = ctx.args;

  return {
    operation: 'Query',
    query: {
      expression: 'pk = :accountId',
      expressionValues: {
        ':accountId': `acc${util.dynamodb.toDynamoDB(accountId)}`,
      },
    },
    filter: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB(ctx.identity.username),
      },
    },
    limit: 1,
  };
}

export function response(ctx) {
  console.log('🔔 GetAccount Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result.items[0];
}
