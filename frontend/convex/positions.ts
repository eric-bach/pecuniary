import { query, internalMutation } from './_generated/server';
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

    // Calculate total commissions paid
    const totalCommissions = transactions.reduce((sum, tx) => sum + (tx.commission ?? 0), 0);

    // Get unique symbols and their latest prices
    const symbols = [...new Set(positions.map((p) => p.symbol))];
    const latestPrices = new Map<string, number>();
    
    for (const symbol of symbols) {
      const latestQuote = await ctx.db
        .query('historicalQuotes')
        .withIndex('by_symbol_date', (q) => q.eq('symbol', symbol))
        .order('desc')
        .first();
      if (latestQuote) {
        latestPrices.set(symbol, latestQuote.closePrice);
      }
    }

    // Map dividends by symbol
    const dividendsBySymbol = new Map<string, number>();
    let totalDividends = 0;
    for (const tx of transactions) {
      if (tx.type === 'dividend') {
        const divAmount = tx.shares * tx.unitPrice;
        totalDividends += divAmount;
        dividendsBySymbol.set(tx.symbol, (dividendsBySymbol.get(tx.symbol) || 0) + divAmount);
      }
    }

    return {
      positionCount: positions.length,
      totalCostBasis,
      totalDividends,
      totalCommissions,
      symbols,
      positions: positions.map((p) => {
        const currentPrice = latestPrices.get(p.symbol) || 0;
        const currentValue = currentPrice * p.shares;
        return {
          symbol: p.symbol,
          shares: p.shares,
          costBasis: p.costBasis,
          averageCost: p.shares > 0 ? p.costBasis / p.shares : 0,
          currentPrice,
          currentValue,
          unrealizedGain: currentValue - p.costBasis,
          totalDividends: dividendsBySymbol.get(p.symbol) || 0,
        };
      }),
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
    const symbolMap = new Map<string, { shares: number; costBasis: number; totalDividends: number }>();

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
            totalDividends: 0,
          });
        }
      }

      const transactions = await ctx.db
        .query('investmentTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();

      for (const tx of transactions) {
        if (tx.type === 'dividend') {
          const divAmount = tx.shares * tx.unitPrice;
          totalDividends += divAmount;
          
          const existing = symbolMap.get(tx.symbol);
          if (existing) {
            existing.totalDividends += divAmount;
          } else {
             symbolMap.set(tx.symbol, {
              shares: 0,
              costBasis: 0,
              totalDividends: divAmount,
            });
          }
        }
        totalCommissions += tx.commission ?? 0;
      }
    }

    // Get latest prices for all symbols
    const latestPrices = new Map<string, number>();
    for (const symbol of symbolMap.keys()) {
      const latestQuote = await ctx.db
        .query('historicalQuotes')
        .withIndex('by_symbol_date', (q) => q.eq('symbol', symbol))
        .order('desc')
        .first();
      if (latestQuote) {
        latestPrices.set(symbol, latestQuote.closePrice);
      }
    }

    // Convert symbol map to sorted array
    const holdings = Array.from(symbolMap.entries())
      .map(([symbol, data]) => {
        const currentPrice = latestPrices.get(symbol) || 0;
        const currentValue = currentPrice * data.shares;
        return {
          symbol,
          shares: data.shares,
          costBasis: data.costBasis,
          averageCost: data.shares > 0 ? data.costBasis / data.shares : 0,
          currentPrice,
          currentValue,
          unrealizedGain: currentValue - data.costBasis,
          totalDividends: data.totalDividends,
        };
      })
      .sort((a, b) => b.currentValue - a.currentValue);

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

    // Sort by date ascending for chronologoical display
    transactions.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a._creationTime - b._creationTime;
    });

    return transactions.map((tx) => {
      return {
        date: tx.date,
        type: tx.type,
        shares: tx.shares,
        unitPrice: tx.unitPrice,
        total: tx.shares * tx.unitPrice,
        commission: tx.commission ?? 0,
        runningShares: tx.runningShares ?? 0,
        runningCostBasis: tx.runningCostBasis ?? 0,
        averageCost: tx.averageCost ?? 0,
        realizedGain: tx.realizedGain,
      };
    });
  },
});

export const updatePositionClassification = internalMutation({
  args: {
    symbol: v.string(),
    sector: v.string(),
    assetType: v.string(),
  },
  handler: async (ctx, args) => {
    // Find all positions for this symbol
    const positions = await ctx.db
      .query('positions')
      .filter((q: any) => q.eq(q.field('symbol'), args.symbol))
      .collect();

    // Patch them all with the fetched classification
    for (const pos of positions) {
      // Only overwrite if they are currently blank to avoid overwriting user manual edits later
      const patch: any = {};
      if (!pos.sector) patch.sector = args.sector;
      if (!pos.assetType) patch.assetType = args.assetType;

      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(pos._id, patch);
      }
    }
  },
});
