import { util } from '@aws-appsync/utils';

export function request(ctx) {
  console.log('🔔 UpdateAccount Request: ', ctx);

  return {
    operation: 'UpdateItem',
    key: {
      pk: util.dynamodb.toDynamoDB(ctx.args.input.pk),
      createdAt: util.dynamodb.toDynamoDB(ctx.args.input.createdAt),
    },
    update: {
      expression: 'SET #name = :name, #type = :type, updatedAt = :updatedAt',
      expressionNames: {
        '#name': 'name',
        '#type': 'type',
      },
      expressionValues: {
        ':type': util.dynamodb.toDynamoDB(ctx.args.input.type),
        ':name': util.dynamodb.toDynamoDB(ctx.args.input.name),
        ':updatedAt': util.dynamodb.toDynamoDB(util.time.nowISO8601()),
      },
    },
    condition: {
      expression: 'userId = :userId',
      expressionValues: {
        ':userId': util.dynamodb.toDynamoDB(ctx.identity.username),
      },
    },
  };
}

export function response(ctx) {
  console.log('🔔 UpdateAccount Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.result;
}
