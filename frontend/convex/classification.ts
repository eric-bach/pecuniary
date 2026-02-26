'use node';

import { action } from './_generated/server';
import { v } from 'convex/values';
import { api, internal } from './_generated/api';
import YahooFinance from 'yahoo-finance2';

export const fetchAndSaveProfile = action({
  args: {
    symbol: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`Fetching profile for ${args.symbol}`);
      const yf = new YahooFinance();
      const result = (await yf.quoteSummary(args.symbol, { modules: ['assetProfile', 'price'] })) as any;

      let sector = '';
      let assetType = '';

      if (result.assetProfile && result.assetProfile.sector) {
        sector = result.assetProfile.sector;
      }

      if (result.price && result.price.quoteType) {
        // Map Yahoo's quoteType to our simpler assetType terminology
        const qt = result.price.quoteType.toUpperCase();
        if (qt === 'EQUITY') assetType = 'Stock';
        else if (qt === 'ETF') assetType = 'ETF';
        else if (qt === 'MUTUALFUND') assetType = 'Mutual Fund';
        else if (qt === 'CRYPTOCURRENCY' || qt === 'CRYPTO') assetType = 'Crypto';
        else assetType = qt; // Fallback
      }

      if (sector || assetType) {
        console.log(`Found classification for ${args.symbol}: Sector=${sector}, Type=${assetType}`);

        // Call the internal mutation to patch all matching positions
        await ctx.runMutation(internal.positions.updatePositionClassification, {
          symbol: args.symbol,
          sector,
          assetType,
        });
      }

      return { success: true, sector, assetType };
    } catch (error) {
      console.error(`Failed to fetch profile for ${args.symbol}:`, error);
      return { success: false, error: String(error) };
    }
  },
});
