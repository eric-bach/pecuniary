'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { updateCategory } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { MutationUpdateCategoryArgs } from '@/../../backend/src/appsync/api/codegen/appsync';
import { schema } from '@/types/category';

interface EditCategoryFormState {
  errors: {
    pk?: string[];
    name?: string[];
    _form?: string[];
  };
}

export async function editExistingCategory({ pk, name }: MutationUpdateCategoryArgs) {
  const result = schema.safeParse({
    name,
    pk,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
      query: updateCategory,
      variables: {
        pk,
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

  revalidatePath('/categories', 'layout');
}
