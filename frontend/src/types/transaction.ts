import { z } from 'zod';

export const investmentSchema = z.object({
  createdAt: z.string().optional(),
  accountId: z.string().min(1, 'Account Id is required'),
  transactionId: z.string().optional(),
  transactionDate: z.date(),
  type: z.string().min(1, 'Type is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  shares: z.string().min(1, 'Shares is required'),
  price: z.string().min(1, 'Price is required'),
  commission: z.string().min(1, 'Commission is required'),
});

export const bankingSchema = z.object({
  createdAt: z.string().optional(),
  accountId: z.string().min(1, 'Account Id is required'),
  transactionId: z.string().optional(),
  transactionDate: z.date(),
  payee: z.string().min(1, 'Payee is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required'),
});
