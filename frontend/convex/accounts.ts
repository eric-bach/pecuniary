import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal('Cash'), v.literal('Investment'), v.literal('Real Estate'), v.literal('Credit Cards'), v.literal('Loans')),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accountId = await ctx.db.insert('accounts', {
      name: args.name,
      description: args.description,
      type: args.type,
      userId: args.userId,
    });
    return accountId;
  },
});

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

export const get = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.accountId);
  },
});
