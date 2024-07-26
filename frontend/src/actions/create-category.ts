'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createCategory } from '@/../../backend/src/appsync/api/mutations';
import { schema } from '@/types/category';
import { revalidatePath } from 'next/cache';

interface CreateCategoryFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createNewCategory(name: string) {
  const result = schema.safeParse({
    name,
  });

  console.log('Create Category Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
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

  revalidatePath('/categories');
}
