'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { createCategory } from '@/../../backend/src/appsync/api/mutations';
import { schema } from '@/types/category';

interface CreateCategoryFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createNewCategory(name: string): Promise<CreateCategoryFormState> {
  const result = schema.safeParse({
    name,
  });

  console.log('Create Category Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: createCategory,
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
