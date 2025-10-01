'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createSymbol } from './api/mutations';
import { schema } from '@/types/symbol';

interface CreateSymbolFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createNewSymbol(name: string): Promise<CreateSymbolFormState> {
  const result = schema.safeParse({
    name,
  });

  console.log('Create Symbol Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
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

  return { errors: {} };
}
