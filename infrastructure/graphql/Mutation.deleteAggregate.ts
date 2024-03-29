import { Context, util, runtime, DynamoDBBatchDeleteItemRequest } from '@aws-appsync/utils';
import { Aggregates } from './types/appsync';

export function request(ctx: Context<string>): DynamoDBBatchDeleteItemRequest {
  console.log('🔔 DeleteAccount Request: ', ctx);

  const aggregates = ctx.prev.result;

  // Early Return if no records to delete
  if (aggregates.length === 0) {
    runtime.earlyReturn([{}]);
  }

  let data = [];
  for (var index in aggregates) {
    data.push(util.dynamodb.toMapValues({ pk: aggregates[index].pk, createdAt: aggregates[index].createdAt }));
  }

  return {
    operation: 'BatchDeleteItem',
    tables: {
      'pecuniary-Data': data,
    },
  };
}

export function response(ctx: Context<string>): Aggregates {
  console.log('🔔 DeleteAccount Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return { items: ctx.prev.result };
  // const deleted = ctx.result.data['pecuniary-Data'];
  // return { deleted };
}
