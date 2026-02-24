import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  accounts: defineTable({
    name: v.string(),
    description: v.optional(v.string()), // Made optional to be safe, but can be required
    type: v.union(v.literal('Cash'), v.literal('Investment'), v.literal('Real Estate'), v.literal('Credit Cards'), v.literal('Loans')),
    currency: v.optional(v.union(v.literal('USD'), v.literal('CAD'))), // Optional, used for Investment accounts
    userId: v.string(),
  }).index('by_user', ['userId']),

  cashTransactions: defineTable({
    accountId: v.id('accounts'),
    date: v.string(),
    payee: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.union(v.literal('debit'), v.literal('credit')),
    amount: v.number(),
  }).index('by_account', ['accountId']),

  investmentTransactions: defineTable({
    accountId: v.id('accounts'),
    date: v.string(),
    type: v.union(
      v.literal('buy'),
      v.literal('sell'),
      v.literal('dividend'),
      v.literal('split'),
      v.literal('transfer_in'),
      v.literal('transfer_out'),
    ),
    symbol: v.string(),
    shares: v.number(),
    unitPrice: v.number(),
    commission: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index('by_account', ['accountId'])
    .index('by_account_symbol', ['accountId', 'symbol']),

  positions: defineTable({
    accountId: v.id('accounts'),
    symbol: v.string(),
    shares: v.number(),
    costBasis: v.number(),
    lastUpdated: v.string(),
    assetType: v.optional(
      v.union(
        v.literal('Stock'),
        v.literal('ETF'),
        v.literal('Bond'),
        v.literal('Cash'),
        v.literal('Other')
      )
    ),
    sector: v.optional(
      v.union(
        v.literal('Technology'),
        v.literal('Finance'),
        v.literal('Healthcare'),
        v.literal('Energy'),
        v.literal('Consumer'),
        v.literal('Other')
      )
    ),
  })
    .index('by_account', ['accountId'])
    .index('by_account_symbol', ['accountId', 'symbol']),
});
