'use node';

import { action } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import YahooFinance from 'yahoo-finance2';

export const fetchHistoricalQuotes = action({
  args: {
    symbol: v.string(),
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    try {
      let period1 = args.startDate;
      let period2 = args.endDate;

      if (period1 === period2) {
        const nextDay = new Date(period2);
        nextDay.setDate(nextDay.getDate() + 1);
        period2 = nextDay.toISOString().split('T')[0];
      }

      const queryOptions = {
        period1,
        period2,
        interval: '1d' as const,
      };

      const yahooFinance = new YahooFinance();
      const result = (await yahooFinance.chart(args.symbol, queryOptions)) as any;
      const quotes = result.quotes || [];

      // Filter out any results that might not have a close price
      const validQuotes = quotes
        .filter((q: any) => q.close !== null && q.close !== undefined)
        .map((q: any) => ({
          date: q.date.toISOString().split('T')[0], // Extract YYYY-MM-DD
          closePrice: q.close,
        }));

      if (validQuotes.length > 0) {
        await ctx.runMutation(internal.quoteStore.saveHistoricalQuotes, {
          symbol: args.symbol,
          quotes: validQuotes,
        });
      }

      return { success: true, count: validQuotes.length };
    } catch (error) {
      console.error(`Failed to fetch quotes for ${args.symbol}:`, error);
      return { success: false, error: String(error) };
    }
  },
});

export const searchSymbols = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.query || args.query.trim().length === 0) {
        return [];
      }

      const yahooFinance = new YahooFinance();
      const results = await yahooFinance.search(args.query);

      // Filter out news results and only return quotes
      const quotes = results.quotes || [];

      return quotes.map((q: any) => ({
        symbol: q.symbol,
        shortname: q.shortname,
        exchange: q.exchange,
      }));
    } catch (error) {
      console.error(`Failed to search symbols for ${args.query}:`, error);
      return [];
    }
  },
});
