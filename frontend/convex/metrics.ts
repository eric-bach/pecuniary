import { query } from './_generated/server';
import { v } from 'convex/values';

export const calculateAccountPerformance = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    // 1. Fetch all transactions for the account
    const transactions = await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();

    // Sort transactions chronologically
    transactions.sort((a, b) => a.date.localeCompare(b.date));

    // 2. Track holdings and calculate realize P&L and total ACB
    const holdings = new Map<string, { shares: number; totalAcb: number }>();
    let totalRealizedPl = 0;

    for (const t of transactions) {
      if (!holdings.has(t.symbol)) {
        holdings.set(t.symbol, { shares: 0, totalAcb: 0 });
      }

      const holding = holdings.get(t.symbol)!;

      if (t.type === 'buy') {
        // Increase bookValue (ACB) by cost of new shares
        const cost = t.shares * t.unitPrice + (t.commission || 0);
        holding.totalAcb += cost;
        holding.shares += t.shares;
      } else if (t.type === 'sell') {
        if (holding.shares > 0) {
          // Average cost per share
          const acbPerShare = holding.totalAcb / holding.shares;

          // Cost basis of shares being sold
          const costBasisOfSold = t.shares * acbPerShare;

          // Net proceeds
          const netProceeds = t.shares * t.unitPrice - (t.commission || 0);

          // Realized P&L
          const realizedPl = netProceeds - costBasisOfSold;
          totalRealizedPl += realizedPl;

          // Decrease total ACB and shares
          holding.totalAcb -= costBasisOfSold;
          holding.shares -= t.shares;
        }
      } else if (t.type === 'split') {
        // Shares split, total ACB stays the same
        holding.shares = holding.shares * t.shares;
      } else if (t.type === 'transfer_in') {
        // Assuming transfer_in brings its own cost basis (represented as unitPrice * shares + commission)
        const cost = t.shares * t.unitPrice + (t.commission || 0);
        holding.totalAcb += cost;
        holding.shares += t.shares;
      } else if (t.type === 'transfer_out') {
        if (holding.shares > 0) {
          const acbPerShare = holding.totalAcb / holding.shares;
          const costBasisOfTransferred = t.shares * acbPerShare;

          holding.totalAcb -= costBasisOfTransferred;
          holding.shares -= t.shares;
          // No realized P&L on transfer out usually
        }
      }
      // Note: Dividends are usually cash deposited into the account, handled separately or as Return of Capital

      // Clean up empty positions
      if (holding.shares <= 0) {
        // holding.shares = 0; // Prevent negative shares theoretically
        // holding.totalAcb = 0;
      }
    }

    // 3. To calculate Unrealized P&L, we would need current quotes for each holding
    // We will sum up the total ACB (Book Value) of current holdings and fetch the latest market quotes
    let totalBookValue = 0;
    let totalMarketValue = 0;

    // We will collect active symbols to fetch prices later
    const currentPositions: { symbol: string; shares: number; acb: number; marketValue?: number; currentPrice?: number }[] = [];

    for (const [symbol, holding] of holdings.entries()) {
      if (holding.shares > 0) {
        totalBookValue += holding.totalAcb;

        // Find latest quote for this symbol
        const latestQuote = await ctx.db
          .query('historicalQuotes')
          .withIndex('by_symbol_date', (q) => q.eq('symbol', symbol))
          .order('desc')
          .first();

        let marketValue: number | undefined = undefined;
        let currentPrice: number | undefined = undefined;

        if (latestQuote) {
          currentPrice = latestQuote.closePrice;
          marketValue = holding.shares * currentPrice;
          totalMarketValue += marketValue;
        }

        currentPositions.push({
          symbol,
          shares: holding.shares,
          acb: holding.totalAcb,
          marketValue,
          currentPrice,
        });
      }
    }

    const unrealizedPl = totalMarketValue > 0 ? totalMarketValue - totalBookValue : 0;

    return {
      totalBookValue,
      totalRealizedPl,
      totalMarketValue,
      unrealizedPl,
      currentPositions,
    };
  },
});

// Helper function to get dates between start and end date
function getDatesInRange(startDate: Date, endDate: Date) {
  const dateArray: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export const getAccountHistoricalBalance = query({
  args: {
    accountId: v.id('accounts'),
    days: v.optional(v.number()), // Defaults to 30 days
  },
  handler: async (ctx, args) => {
    const daysToReport = args.days ?? 30;

    // Timeline boundaries
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysToReport);

    // Generate all dates in range as YYYY-MM-DD
    const dateRange: string[] = getDatesInRange(startDate, endDate).map((d: Date) => d.toISOString().split('T')[0]);

    // 1. Fetch all transactions for the account
    const transactions = await ctx.db
      .query('investmentTransactions')
      .withIndex('by_account', (q: any) => q.eq('accountId', args.accountId))
      .collect();

    // Sort chronologically
    transactions.sort((a: any, b: any) => a.date.localeCompare(b.date));

    // Get unique symbols
    const symbols = [...new Set(transactions.map((t: any) => t.symbol))];

    // Setup a lookup cache for quotes
    const quotesCache = new Map<string, Map<string, number>>();

    for (const sym of symbols) {
      const symbolQuotes = await ctx.db
        .query('historicalQuotes')
        .withIndex('by_symbol_date', (q: any) => q.eq('symbol', sym))
        .collect();

      const symbolDateMap = new Map<string, number>();
      for (const sq of symbolQuotes) {
        symbolDateMap.set(sq.date, sq.closePrice);
      }
      quotesCache.set(sym as string, symbolDateMap);
    }

    // Build chronological state
    const historicalData: { date: string; totalMarketValue: number; totalBookValue: number }[] = [];
    const currentHoldings = new Map<string, { shares: number; costBasis: number }>();

    let txIndex = 0;
    while (txIndex < transactions.length && transactions[txIndex].date < dateRange[0]) {
      const tx = transactions[txIndex];
      currentHoldings.set(tx.symbol, {
        shares: tx.runningShares ?? 0,
        costBasis: tx.runningCostBasis ?? 0,
      });
      txIndex++;
    }

    for (const dateStr of dateRange) {
      // Apply any transactions that happened exactly on this day
      while (txIndex < transactions.length && transactions[txIndex].date === dateStr) {
        const tx = transactions[txIndex];
        currentHoldings.set(tx.symbol, {
          shares: tx.runningShares ?? 0,
          costBasis: tx.runningCostBasis ?? 0,
        });
        txIndex++;
      }

      let dailyMarketValue = 0;
      let dailyBookValue = 0;

      for (const [sym, holding] of currentHoldings.entries()) {
        if (holding.shares > 0) {
          dailyBookValue += holding.costBasis;

          const symbolDateMap = quotesCache.get(sym);
          let closestPrice = 0;

          if (symbolDateMap) {
            if (symbolDateMap.has(dateStr)) {
              closestPrice = symbolDateMap.get(dateStr)!;
            } else {
              // Scan backward to find most recent quote
              let scanDate = new Date(dateStr);
              for (let i = 0; i < 30; i++) {
                scanDate.setDate(scanDate.getDate() - 1);
                const scanStr = scanDate.toISOString().split('T')[0];
                if (symbolDateMap.has(scanStr)) {
                  closestPrice = symbolDateMap.get(scanStr)!;
                  break;
                }
              }
            }
          }

          dailyMarketValue += holding.shares * closestPrice;
        }
      }

      historicalData.push({
        date: dateStr,
        totalMarketValue: dailyMarketValue,
        totalBookValue: dailyBookValue,
      });
    }

    return historicalData;
  },
});

export const getInvestmentBalancesByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Return a map of accountId to its current total market value
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => q.eq(q.field('type'), 'Investment'))
      .collect();

    const balances: Record<string, number> = {};

    for (const account of accounts) {
      const transactions = await ctx.db
        .query('investmentTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();

      const holdings = new Map<string, number>();
      for (const t of transactions) {
        if (!holdings.has(t.symbol)) holdings.set(t.symbol, 0);
        let shares = holdings.get(t.symbol)!;
        if (t.type === 'buy' || t.type === 'transfer_in') shares += t.shares;
        else if (t.type === 'sell' || t.type === 'transfer_out') shares -= t.shares;
        else if (t.type === 'split') shares = shares * t.shares;
        holdings.set(t.symbol, shares);
      }

      let marketValue = 0;
      for (const [symbol, shares] of holdings.entries()) {
        if (shares > 0) {
          const latestQuote = await ctx.db
            .query('historicalQuotes')
            .withIndex('by_symbol_date', (q) => q.eq('symbol', symbol))
            .order('desc')
            .first();
          if (latestQuote) marketValue += shares * latestQuote.closePrice;
        }
      }
      balances[account._id] = marketValue;
    }
    return balances;
  },
});

export const getUserNetWorthHistory = query({
  args: {
    userId: v.string(),
    days: v.optional(v.number()), // Defaults to 30 days
  },
  handler: async (ctx, args) => {
    const daysToReport = args.days ?? 30;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysToReport);

    const dateRange: string[] = getDatesInRange(startDate, endDate).map((d: Date) => d.toISOString().split('T')[0]);

    // 1. Get Accounts
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // 2. Compute Cash Balances for all accounts
    const allCashTxs: Array<{ date: string; type: 'debit' | 'credit'; amount: number }> = [];
    const investmentTxs: Array<{
      date: string;
      type: string;
      symbol: string;
      shares: number;
      runningShares?: number;
      runningCostBasis?: number;
      _creationTime: number;
    }> = [];

    for (const account of accounts) {
      const cashTxs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      allCashTxs.push(...cashTxs);

      if (account.type === 'Investment') {
        const invTxs = await ctx.db
          .query('investmentTransactions')
          .withIndex('by_account', (q) => q.eq('accountId', account._id))
          .collect();
        investmentTxs.push(...invTxs);
      }
    }

    // Process Cash Txs
    allCashTxs.sort((a: any, b: any) => a.date.localeCompare(b.date));
    let cashBalance = 0;
    let cashTxIndex = 0;

    // Process Investment Txs
    investmentTxs.sort((a: any, b: any) => a.date.localeCompare(b.date));
    const symbols = [...new Set(investmentTxs.map((t: any) => t.symbol))];
    const quotesCache = new Map<string, Map<string, number>>();
    for (const sym of symbols) {
      const symbolQuotes = await ctx.db
        .query('historicalQuotes')
        .withIndex('by_symbol_date', (q: any) => q.eq('symbol', sym))
        .collect();

      const symbolDateMap = new Map<string, number>();
      for (const sq of symbolQuotes) {
        symbolDateMap.set(sq.date, sq.closePrice);
      }
      quotesCache.set(sym as string, symbolDateMap);
    }
    const currentHoldings = new Map<string, { shares: number }>();
    let invTxIndex = 0;

    // Fast Forward to Date[0]
    while (cashTxIndex < allCashTxs.length && allCashTxs[cashTxIndex].date < dateRange[0]) {
      const tx = allCashTxs[cashTxIndex];
      cashBalance += tx.type === 'credit' ? tx.amount : -tx.amount;
      cashTxIndex++;
    }
    while (invTxIndex < investmentTxs.length && investmentTxs[invTxIndex].date < dateRange[0]) {
      const tx = investmentTxs[invTxIndex];
      currentHoldings.set(tx.symbol, { shares: tx.runningShares ?? 0 });
      invTxIndex++;
    }

    const historicalData: { date: string; balance: number }[] = [];

    for (const dateStr of dateRange) {
      // Cash
      while (cashTxIndex < allCashTxs.length && allCashTxs[cashTxIndex].date === dateStr) {
        const tx = allCashTxs[cashTxIndex];
        cashBalance += tx.type === 'credit' ? tx.amount : -tx.amount;
        cashTxIndex++;
      }

      // Investment
      while (invTxIndex < investmentTxs.length && investmentTxs[invTxIndex].date === dateStr) {
        const tx = investmentTxs[invTxIndex];
        currentHoldings.set(tx.symbol, { shares: tx.runningShares ?? 0 });
        invTxIndex++;
      }

      let dailyMarketValue = 0;
      for (const [sym, holding] of currentHoldings.entries()) {
        if (holding.shares > 0) {
          const symbolDateMap = quotesCache.get(sym);
          let closestPrice = 0;
          if (symbolDateMap) {
            if (symbolDateMap.has(dateStr)) closestPrice = symbolDateMap.get(dateStr)!;
            else {
              let scanDate = new Date(dateStr);
              for (let i = 0; i < 30; i++) {
                scanDate.setDate(scanDate.getDate() - 1);
                const scanStr = scanDate.toISOString().split('T')[0];
                if (symbolDateMap.has(scanStr)) {
                  closestPrice = symbolDateMap.get(scanStr)!;
                  break;
                }
              }
            }
          }
          dailyMarketValue += holding.shares * closestPrice;
        }
      }

      historicalData.push({
        date: dateStr,
        balance: cashBalance + dailyMarketValue,
      });
    }

    return historicalData;
  },
});
