import { z } from 'zod';

export const categories: string[] = ['Banking', 'Credit Card', 'Investment', 'Asset'];
export const investmentTypes: string[] = ['Non Registered', 'TFSA', 'RRSP', 'LIRA', 'Crypto'];
export const bankingTypes: string[] = ['Chequing', 'Savings'];
export const creditCardTypes: string[] = ['Credit'];
export const assetTypes: string[] = ['Property'];

export const schema = z
  .object({
    name: z.string().min(1, 'Account name is required'),
    category: z.string().refine((value) => categories.includes(value), {
      message: 'Category is required',
    }),
    type: z.string().min(1, 'Type is required'),
    accountId: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.category === 'Investment') {
        return investmentTypes.includes(data.type);
      } else if (data.category === 'Banking') {
        return bankingTypes.includes(data.type);
      } else if (data.category === 'Credit Card') {
        return creditCardTypes.includes(data.type);
      } else if (data.category === 'Asset') {
        return assetTypes.includes(data.type);
      }

      return true;
    },
    {
      message: 'Type is not a valid type',
    }
  );
