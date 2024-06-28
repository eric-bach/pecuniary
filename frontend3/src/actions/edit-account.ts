'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { updateAccount } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateAccountInput } from '../../../infrastructure/graphql/api/codegen/appsync';

const schema = z.object({
  name: z.string().min(1, 'Name cannot be blank'),
  category: z
    .string()
    .refine(
      (value: string) => value === 'Banking' || value === 'Credit Card' || value === 'Investment' || value === 'Asset',
      'Category is not a valid type'
    ),
  type: z.string().refine((value: string) => value === 'TFSA' || value === 'RRSP', 'Type must be either TFSA or RRSP'),
  accountId: z.string(),
  createdAt: z.string(),
});

interface EditAccountFormState {
  errors: {
    name?: string[];
    category?: string[];
    type?: string[];
    accountId?: string[];
    createdAt?: string[];
    _form?: string[];
  };
}

export async function editExistingAccount({
  accountId,
  createdAt,
  name,
  category,
  type,
}: UpdateAccountInput): Promise<EditAccountFormState> {
  const result = schema.safeParse({
    name,
    category,
    type,
    accountId,
    createdAt,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: updateAccount,
      variables: {
        input: {
          accountId: result.data.accountId,
          createdAt: result.data.createdAt,
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

  revalidatePath('/', 'layout');
  redirect('/accounts');
}
