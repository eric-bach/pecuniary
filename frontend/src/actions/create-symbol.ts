'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { createSymbol } from '@/../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { schema } from '@/types/symbol';

interface CreateSymbolFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createNewSymbol({ name, accountId }: { name: string; accountId: string }): Promise<CreateSymbolFormState> {
  const result = schema.safeParse({
    name,
  });

  console.log('Create Symbol Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: createSymbol,
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

  revalidatePath(`/accounts/${accountId}`, 'layout');

  return { errors: {} };
}
