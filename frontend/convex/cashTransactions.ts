import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    accountId: v.id('accounts'),
    date: v.string(),
    payee: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.union(v.literal('debit'), v.literal('credit')),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert('cashTransactions', {
      accountId: args.accountId,
      date: args.date,
      payee: args.payee,
      description: args.description,
      category: args.category,
      type: args.type,
      amount: args.amount,
    });
    return transactionId;
  },
});

export const update = mutation({
  args: {
    transactionId: v.id('cashTransactions'),
    date: v.string(),
    payee: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    type: v.union(v.literal('debit'), v.literal('credit')),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { transactionId, ...fields } = args;
    await ctx.db.patch(transactionId, fields);
    return transactionId;
  },
});

export const remove = mutation({
  args: {
    transactionId: v.id('cashTransactions'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.transactionId);
  },
});

export const listByAccount = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('cashTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .order('desc')
      .collect();
  },
});

export const getBalance = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('cashTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();
    return txs.reduce((sum, tx) => {
      return tx.type === 'credit' ? sum + tx.amount : sum - tx.amount;
    }, 0);
  },
});

export const getBalancesByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all accounts for the user
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // For each account, sum its transactions
    const balances: Record<string, number> = {};
    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      balances[account._id] = txs.reduce((sum, tx) => {
        return tx.type === 'credit' ? sum + tx.amount : sum - tx.amount;
      }, 0);
    }
    return balances;
  },
});

// Helpers
function runningBalance(txs: Array<{ date: string; type: 'debit' | 'credit'; amount: number }>): Array<{ date: string; balance: number }> {
  // Sort ascending by date string (YYYY-MM-DD sorts lexicographically correctly)
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));

  let balance = 0;
  const points: Array<{ date: string; balance: number }> = [];

  for (const tx of sorted) {
    balance += tx.type === 'credit' ? tx.amount : -tx.amount;
    // If same date has multiple transactions, overwrite so we only keep final balance for that day
    if (points.length > 0 && points[points.length - 1].date === tx.date) {
      points[points.length - 1].balance = balance;
    } else {
      points.push({ date: tx.date, balance });
    }
  }

  return points;
}

export const getBalanceHistory = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('cashTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();
    return runningBalance(txs);
  },
});

export const getTotalBalanceHistory = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // Gather all transactions across all accounts
    const allTxs: Array<{ date: string; type: 'debit' | 'credit'; amount: number }> = [];
    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      allTxs.push(...txs);
    }

    return runningBalance(allTxs);
  },
});

export const getPayeeSuggestions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    // Collect all transactions across all accounts
    const allTxs: Array<{ payee: string; category?: string; _creationTime: number }> = [];
    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      allTxs.push(...txs);
    }

    // Sort by creation time descending so we get the most recent first
    allTxs.sort((a, b) => b._creationTime - a._creationTime);

    // Build a map of payee -> most recently used category
    const payeeMap = new Map<string, string | undefined>();
    for (const tx of allTxs) {
      if (!payeeMap.has(tx.payee)) {
        payeeMap.set(tx.payee, tx.category);
      }
    }

    return Array.from(payeeMap.entries()).map(([payee, lastCategory]) => ({
      payee,
      lastCategory,
    }));
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
      .collect();

    const allTxs: Array<{
      _id: string;
      accountId: string;
      accountName: string;
      accountType: string;
      date: string;
      payee: string;
      description?: string;
      category?: string;
      type: 'debit' | 'credit';
      amount: number;
      _creationTime: number;
    }> = [];

    const accountMap = new Map(accounts.map((a) => [a._id, { name: a.name, type: a.type }]));

    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      for (const tx of txs) {
        const info = accountMap.get(tx.accountId);
        allTxs.push({
          ...tx,
          accountName: info?.name ?? '',
          accountType: info?.type ?? '',
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

export const getRecentByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const allTxs: Array<{
      _id: string;
      accountId: string;
      accountName: string;
      date: string;
      payee: string;
      description?: string;
      category?: string;
      type: 'debit' | 'credit';
      amount: number;
      _creationTime: number;
    }> = [];

    const accountMap = new Map(accounts.map((a) => [a._id, a.name]));

    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .order('desc')
        .take(args.limit ?? 10);
      for (const tx of txs) {
        allTxs.push({ ...tx, accountName: accountMap.get(tx.accountId) ?? '' });
      }
    }

    // Sort by creation time descending and take the limit
    allTxs.sort((a, b) => b._creationTime - a._creationTime);
    return allTxs.slice(0, args.limit ?? 10);
  },
});

export const getSpendingByMonth = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const allTxs: Array<{ date: string; type: 'debit' | 'credit'; amount: number }> = [];
    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      allTxs.push(...txs);
    }

    // Group spending (debits) by YYYY-MM month
    const monthMap = new Map<string, number>();
    for (const tx of allTxs) {
      if (tx.type !== 'debit') continue;
      const month = tx.date.substring(0, 7); // "YYYY-MM"
      monthMap.set(month, (monthMap.get(month) ?? 0) + tx.amount);
    }

    // Return sorted ascending
    return Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, total]) => ({ month, total }));
  },
});

export const getCategoryBreakdown = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('cashTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();

    // Only look at debits (spending), group by category
    const totals = new Map<string, number>();
    for (const tx of txs) {
      if (tx.type !== 'debit') continue;
      const cat = tx.category?.trim() || 'Uncategorized';
      totals.set(cat, (totals.get(cat) ?? 0) + tx.amount);
    }

    // Sort descending by amount
    const sorted = Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // Keep top 5, bucket the rest into "Other"
    if (sorted.length <= 6) return sorted;
    const top = sorted.slice(0, 5);
    const otherTotal = sorted.slice(5).reduce((s, c) => s + c.value, 0);
    return [...top, { name: 'Other', value: otherTotal }];
  },
});

export const getCategoryBreakdownByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('accounts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();

    const totals = new Map<string, number>();
    for (const account of accounts) {
      const txs = await ctx.db
        .query('cashTransactions')
        .withIndex('by_account', (q) => q.eq('accountId', account._id))
        .collect();
      for (const tx of txs) {
        if (tx.type !== 'debit') continue;
        const cat = tx.category?.trim() || 'Uncategorized';
        totals.set(cat, (totals.get(cat) ?? 0) + tx.amount);
      }
    }

    const sorted = Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    if (sorted.length <= 6) return sorted;
    const top = sorted.slice(0, 5);
    const otherTotal = sorted.slice(5).reduce((s, c) => s + c.value, 0);
    return [...top, { name: 'Other', value: otherTotal }];
  },
});

export const getIncomeVsExpensesByMonth = query({
  args: {
    accountId: v.id('accounts'),
  },
  handler: async (ctx, args) => {
    const txs = await ctx.db
      .query('cashTransactions')
      .withIndex('by_account', (q) => q.eq('accountId', args.accountId))
      .collect();

    // Group by month
    const monthData = new Map<string, { income: number; expenses: number }>();
    for (const tx of txs) {
      const month = tx.date.substring(0, 7); // "YYYY-MM"
      if (!monthData.has(month)) {
        monthData.set(month, { income: 0, expenses: 0 });
      }
      const data = monthData.get(month)!;
      if (tx.type === 'credit') {
        data.income += tx.amount;
      } else {
        data.expenses += tx.amount;
      }
    }

    // Return sorted ascending by month, with formatted month names
    return Array.from(monthData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => {
        // Format month as "Jan", "Feb", etc.
        const date = new Date(month + '-01');
        const shortMonth = date.toLocaleDateString('en-US', { month: 'short' });
        return {
          month: shortMonth,
          income: data.income,
          expenses: data.expenses,
        };
      });
  },
});
