import { Context, util } from '@aws-appsync/utils';
import { MutationCreateBankTransactionArgs } from './api/codegen/appsync';

export function request(ctx: Context<MutationCreateBankTransactionArgs>) {
  console.log('🔔 PublishEvent Request: ', ctx);

  // const input = ctx.args.input;
  // const identity = ctx.identity as AppSyncIdentityCognito;

  // const eventDetail = {
  //   ...input,
  //   userId: identity.username,
  // };

  return {
    operation: 'PutEvents',
    events: [
      {
        source: 'custom.pecuniary',
        detailType: ctx.prev.result.detailType,
        detail: ctx.prev.result,
        time: util.time.nowISO8601(),
      },
    ],
  };
}

export function response(ctx: Context<MutationCreateBankTransactionArgs>) {
  console.log('🔔 PublishEvent Response: ', ctx);

  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type, ctx.result);
  }

  return ctx.prev.result;
}
