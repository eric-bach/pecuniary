import { internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';

export const saveHistoricalQuotes = internalMutation({
  args: {
    symbol: v.string(),
    quotes: v.array(
      v.object({
        date: v.string(),
        closePrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let savedCount = 0;
    
    for (const quote of args.quotes) {
      // Check if we already have a quote for this symbol and date
      const existing = await ctx.db
        .query('historicalQuotes')
        .withIndex('by_symbol_date', (q) =>
          q.eq('symbol', args.symbol).eq('date', quote.date)
        )
        .first();

      if (!existing) {
        await ctx.db.insert('historicalQuotes', {
          symbol: args.symbol,
          date: quote.date,
          closePrice: quote.closePrice,
        });
        savedCount++;
      } else if (existing.closePrice !== quote.closePrice) {
          // Update if the price changed (unlikely for historical, but robust)
          await ctx.db.patch(existing._id, { closePrice: quote.closePrice });
          savedCount++;
      }
    }
    
    return savedCount;
  },
});

export const getHistoricalQuotes = internalQuery({
  args: {
    symbol: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const quotes = await ctx.db
      .query('historicalQuotes')
      .withIndex('by_symbol_date', (q) => 
        q.eq('symbol', args.symbol)
         .gte('date', args.startDate)
         .lte('date', args.endDate)
      )
      .collect();
      
    return quotes.sort((a, b) => a.date.localeCompare(b.date));
  },
});
