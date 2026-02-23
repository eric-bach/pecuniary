import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert('investmentTransactions', {
      accountId: args.accountId,
      date: args.date,
      type: args.type,
      symbol: args.symbol.toUpperCase(),
      shares: args.shares,
      unitPrice: args.unitPrice,
      commission: args.commission,
      notes: args.notes,
    });

    // Update position after transaction
    await updatePosition(ctx, args.accountId, args.symbol.toUpperCase());

    return transactionId;
  },
});

export const update = mutation({
  args: {
    transactionId: v.id('investmentTransactions'),
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.transactionId);
    if (!existing) throw new Error('Transaction not found');

    const oldSymbol = existing.symbol;
    const newSymbol = args.symbol.toUpperCase();

    const { transactionId, ...fields } = args;
    await ctx.db.patch(transactionId, {
      ...fields,
      symbol: newSymbol,
    });

    // Update positions for both old and new symbols if changed
    await updatePosition(ctx, existing.accountId, oldSymbol);
    if (oldSymbol !== newSymbol) {
      await updatePosition(ctx, existing.accountId, newSymbol);
    }

    return transactionId;
  },
});

export const remove = mutation({
  args: {
    transactionId: v.id('investmentTransactions'),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.transactionId);
    if (!existing) throw new Error('Transaction not found');

    await ctx.db.delete(args.transactionId);

    // Update position after deletion
    await updatePosition(ctx, existing.accountId, existing.symbol);
  },
});

export const listByAccount = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .order('desc')
      .collect();
  },
});

export const listBySymbol = query({
  args: {
    accountId: v.id('accounts'),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account_symbol', (q) => q.eq('accountId', args.accountId).eq('symbol', args.symbol.toUpperCase()))
      .order('desc')
      .collect();
  },
});

export const listAllByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('type'), 'Investment'))
      .collect();

    const allTxs: Array<{
      _id: string;
      accountId: string;
      accountName: string;
      date: string;
      type: 'buy' | 'sell' | 'dividend' | 'split' | 'transfer_in' | 'transfer_out';
      symbol: string;
      shares: number;
      unitPrice: number;
      commission?: number;
      notes?: string;
      _creationTime: number;
    }> = [];

    const accountMap = new Map(accounts.map((a) => [a._id, a.name]));

    for (const account of accounts) {
      const txs = await ctx.db
        .query('investmentTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      for (const tx of txs) {
        allTxs.push({
          ...tx,
          accountName: accountMap.get(tx.accountId) ?? '',
        });
      }
    }

    // Sort by date descending, then by creation time as tiebreaker
    allTxs.sort((a, b) => {
      const dateDiff = b.date.localeCompare(a.date);
      return dateDiff !== 0 ? dateDiff : b._creationTime - a._creationTime;
    });

    return allTxs;
  },
});

// Helper function to recalculate position from transactions
async function updatePosition(ctx: { db: any }, accountId: any, symbol: string) {
  const txs = await ctx.db
    .query('investmentTransactions')
    .withIndex('by_account_symbol', (q: any) => q.eq('accountId', accountId).eq('symbol', symbol))
    .collect();

  // Calculate total shares and cost basis
  let totalShares = 0;
  let totalCostBasis = 0;

  for (const tx of txs) {
    const amount = tx.shares * tx.unitPrice;
    const commission = tx.commission ?? 0;

    switch (tx.type) {
      case 'buy':
      case 'transfer_in':
        totalShares += tx.shares;
        totalCostBasis += amount + commission;
        break;
      case 'sell':
      case 'transfer_out':
        // Proportionally reduce cost basis
        if (totalShares > 0) {
          const ratio = tx.shares / totalShares;
          totalCostBasis -= totalCostBasis * ratio;
        }
        totalShares -= tx.shares;
        break;
      case 'dividend':
        // Dividends don't affect shares or cost basis directly
        // Could track dividend income separately if needed
        break;
      case 'split':
        // For splits, shares increase but cost basis stays same
        // The shares field represents the multiplier (e.g., 2 for a 2:1 split)
        totalShares = totalShares * tx.shares;
        break;
    }
  }

  // Find existing position
  const existingPosition = await ctx.db
    .query('positions')
    .withIndex('by_account_symbol', (q: any) => q.eq('accountId', accountId).eq('symbol', symbol))
    .first();

  const today = new Date().toISOString().split('T')[0];

  if (totalShares <= 0) {
    // Remove position if no shares remaining
    if (existingPosition) {
      await ctx.db.delete(existingPosition._id);
    }
  } else if (existingPosition) {
    // Update existing position
    await ctx.db.patch(existingPosition._id, {
      shares: totalShares,
      costBasis: totalCostBasis,
      lastUpdated: today,
    });
  } else {
    // Create new position
    await ctx.db.insert('positions', {
      accountId,
      symbol,
      shares: totalShares,
      costBasis: totalCostBasis,
      lastUpdated: today,
    });
  }
}
