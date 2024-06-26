'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { createAccount } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateAccountInput } from '../../../infrastructure/graphql/api/codegen/appsync';

const schema = z.object({
  name: z.string().min(1, 'Name cannot be blank'),
  category: z
    .string()
    .refine(
      (value: string) => value === 'Banking' || value === 'Credit Card' || value === 'Investment' || value === 'Asset',
      'Category is not a valid type'
    ),
  type: z.string().refine((value: string) => value === 'TFSA' || value === 'RRSP', 'Type must be either TFSA or RRSP'),
});

interface CreateAccountFormState {
  errors: {
    name?: string[];
    category?: string[];
    type?: string[];
    _form?: string[];
  };
}

export async function createNewAccount({ name, category, type }: CreateAccountInput): Promise<CreateAccountFormState> {
  const result = schema.safeParse({
    name,
    category,
    type,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: createAccount,
      variables: {
        input: {
          name: result.data.name,
          category: result.data.category,
          type: result.data.type,
        },
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ['An unknown error occurred'] } };
    }
  }

  revalidatePath('/accounts');
  redirect('/accounts');
}
