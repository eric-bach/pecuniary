'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { updatePayee } from '../../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { MutationUpdatePayeeArgs } from '../../../backend/src/appsync/api/codegen/appsync';
import { schema } from '@/types/payee';

interface EditPayeeFormState {
  errors: {
    pk?: string[];
    name?: string[];
    _form?: string[];
  };
}

export async function editExistingPayee({ pk, name }: MutationUpdatePayeeArgs) {
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
      query: updatePayee,
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

  revalidatePath('/payees', 'layout');
}
