import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),

  accounts: defineTable({
    name: v.string(),
    description: v.optional(v.string()), // Made optional to be safe, but can be required
    type: v.union(v.literal('Cash'), v.literal('Investment'), v.literal('Real Estate'), v.literal('Credit Cards'), v.literal('Loans')),
    userId: v.string(),
  }).index('by_user', ['userId']),

  transactions: defineTable({
    accountId: v.id('accounts'),
    date: v.string(),
    payee: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.union(v.literal('debit'), v.literal('credit')),
    amount: v.number(),
  }).index('by_account', ['accountId']),
});
