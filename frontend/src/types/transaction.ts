import { z } from 'zod';

export const schema = z.object({
  accountId: z.string().min(1, 'Account Id is required'),
  createdAt: z.string().min(1, 'CreatedAt is required'),
  transactionDate: z.date(),
  type: z.string().min(1, 'Type is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  shares: z.string().min(1, 'Shares is required'),
  price: z.string().min(1, 'Price is required'),
  commission: z.string().min(1, 'Commission is required'),
});
