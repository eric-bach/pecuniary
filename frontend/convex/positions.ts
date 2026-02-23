import { query } from './_generated/server';
import { v } from 'convex/values';

export const listByAccount = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('positions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();
  },
});

export const listByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('type'), 'Investment'))
      .collect();

    const allPositions: Array<{
      _id: string;
      accountId: string;
      accountName: string;
      symbol: string;
      shares: number;
      costBasis: number;
      lastUpdated: string;
    }> = [];

    const accountMap = new Map(accounts.map((a) => [a._id, a.name]));

    for (const account of accounts) {
      const positions = await ctx.db
        .query('positions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      for (const pos of positions) {
        allPositions.push({
          ...pos,
          accountName: accountMap.get(pos.accountId) ?? '',
        });
      }
    }

    return allPositions;
  },
});

export const getPosition = query({
  args: {
    accountId: v.id('accounts'),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('positions')
      .withIndex('by_account_symbol', (q) => q.eq('accountId', args.accountId).eq('symbol', args.symbol.toUpperCase()))
      .first();
  },
});

// Get summary statistics for an investment account
// Note: This returns cost basis info. To calculate actual P&L, you'd need
// current market prices from an external API (not included in this implementation)
export const getAccountSummary = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    const positions = await ctx.db
      .query('positions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();

    const transactions = await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();

    // Calculate total cost basis
    const totalCostBasis = positions.reduce((sum, pos) => sum + pos.costBasis, 0);

    // Calculate total dividends received
    const totalDividends = transactions.filter((tx) => tx.type === 'dividend').reduce((sum, tx) => sum + tx.shares * tx.unitPrice, 0);

    // Calculate total commissions paid
    const totalCommissions = transactions.reduce((sum, tx) => sum + (tx.commission ?? 0), 0);

    // Get unique symbols
    const symbols = [...new Set(positions.map((p) => p.symbol))];

    return {
      positionCount: positions.length,
      totalCostBasis,
      totalDividends,
      totalCommissions,
      symbols,
      positions: positions.map((p) => ({
        symbol: p.symbol,
        shares: p.shares,
        costBasis: p.costBasis,
        averageCost: p.shares > 0 ? p.costBasis / p.shares : 0,
      })),
    };
  },
});

// Get portfolio summary across all investment accounts for a user
export const getPortfolioSummary = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('type'), 'Investment'))
      .collect();

    let totalCostBasis = 0;
    let totalDividends = 0;
    let totalCommissions = 0;
    const symbolMap = new Map<string, { shares: number; costBasis: number }>();

    for (const account of accounts) {
      const positions = await ctx.db
        .query('positions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();

      for (const pos of positions) {
        totalCostBasis += pos.costBasis;
        const existing = symbolMap.get(pos.symbol);
        if (existing) {
          existing.shares += pos.shares;
          existing.costBasis += pos.costBasis;
        } else {
          symbolMap.set(pos.symbol, {
            shares: pos.shares,
            costBasis: pos.costBasis,
          });
        }
      }

      const transactions = await ctx.db
        .query('investmentTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();

      for (const tx of transactions) {
        if (tx.type === 'dividend') {
          totalDividends += tx.shares * tx.unitPrice;
        }
        totalCommissions += tx.commission ?? 0;
      }
    }

    // Convert symbol map to sorted array
    const holdings = Array.from(symbolMap.entries())
      .map(([symbol, data]) => ({
        symbol,
        shares: data.shares,
        costBasis: data.costBasis,
        averageCost: data.shares > 0 ? data.costBasis / data.shares : 0,
      }))
      .sort((a, b) => b.costBasis - a.costBasis);

    return {
      accountCount: accounts.length,
      totalCostBasis,
      totalDividends,
      totalCommissions,
      holdingCount: holdings.length,
      holdings,
    };
  },
});

// Get transaction history grouped by date for a symbol
export const getSymbolHistory = query({
  args: {
    accountId: v.id('accounts'),
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account_symbol', (q) => q.eq('accountId', args.accountId).eq('symbol', args.symbol.toUpperCase()))
      .collect();

    // Sort by date ascending
    transactions.sort((a, b) => a.date.localeCompare(b.date));

    // Build running position history
    let runningShares = 0;
    let runningCostBasis = 0;

    return transactions.map((tx) => {
      const amount = tx.shares * tx.unitPrice;
      const commission = tx.commission ?? 0;

      switch (tx.type) {
        case 'buy':
        case 'transfer_in':
          runningShares += tx.shares;
          runningCostBasis += amount + commission;
          break;
        case 'sell':
        case 'transfer_out':
          if (runningShares > 0) {
            const ratio = tx.shares / runningShares;
            runningCostBasis -= runningCostBasis * ratio;
          }
          runningShares -= tx.shares;
          break;
        case 'split':
          runningShares = runningShares * tx.shares;
          break;
      }

      return {
        date: tx.date,
        type: tx.type,
        shares: tx.shares,
        unitPrice: tx.unitPrice,
        total: amount,
        commission,
        runningShares,
        runningCostBasis,
        averageCost: runningShares > 0 ? runningCostBasis / runningShares : 0,
      };
    });
  },
});
