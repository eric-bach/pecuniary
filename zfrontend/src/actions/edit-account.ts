'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { updateAccount } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { create } from 'domain';

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

export async function editExistingAccount(formState: EditAccountFormState, formData: FormData): Promise<EditAccountFormState> {
  const result = schema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    type: formData.get('type'),
    accountId: formData.get('accountId'),
    createdAt: formData.get('createdAt'),
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
          pk: `acc#${result.data.accountId}`,
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

  revalidatePath('/accounts/manage');
  redirect('/accounts/manage');
}
