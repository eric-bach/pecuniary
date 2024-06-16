'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { z } from 'zod';
import { createAccount } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

export async function createNewAccount(formState: CreateAccountFormState, formData: FormData): Promise<CreateAccountFormState> {
  const result = schema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    type: formData.get('type'),
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

  revalidatePath('/accounts/manage');
  redirect('/accounts/manage');
  //   return data.createAccount;
}
