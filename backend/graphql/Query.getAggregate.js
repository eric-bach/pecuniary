import { util } from '@aws-appsync/utils';

export function request(ctx) {
  console.log('🔔 GetAggregate Request: ', ctx);

  const { accountId, type } = ctx.args;

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
    filter: type
      ? {
          expression: 'userId = :userId AND #type = :type',
          expressionNames: {
            '#type': 'type',
          },
          expressionValues: {
            ':userId': util.dynamodb.toDynamoDB(ctx.identity.username),
            ':type': util.dynamodb.toDynamoDB(ctx.args.type),
          },
        }
      : {
          expression: 'userId = :userId',
          expressionValues: {
            ':userId': util.dynamodb.toDynamoDB(ctx.identity.username),
          },
        },
  };
}

export function response(ctx) {
  console.log('🔔 GetAggregate Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result.items;
}
