'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createPayee } from './api/mutations';
import { schema } from '@/types/payee';
import { revalidatePath } from 'next/cache';

export interface CreatePayeeFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createNewPayee(name: string) {
  const result = schema.safeParse({
    name,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
      query: createPayee,
      variables: {
        name: result.data.name,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ['An unknown error occurred'] } };
    }
  }

  revalidatePath('/payees');
}
