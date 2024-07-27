import { z } from 'zod';

export const schema = z.object({
  pk: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
});
