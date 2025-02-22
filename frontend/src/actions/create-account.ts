'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createAccount } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateAccountInput } from '@/../../backend/src/appsync/api/codegen/appsync';
import { schema } from '@/types/account';

export interface CreateAccountFormState {
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
    data = await serverClient.graphql({
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

  revalidatePath('/', 'layout');
  redirect('/accounts');
}
