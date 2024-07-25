'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { updateAccount } from '../../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateAccountInput } from '../../../backend/src/appsync/api/codegen/appsync';
import { schema } from '@/types/account';

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

export async function editExistingAccount({ accountId, name, category, type }: UpdateAccountInput): Promise<EditAccountFormState> {
  const result = schema.safeParse({
    name,
    category,
    type,
    accountId,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
      query: updateAccount,
      variables: {
        input: {
          accountId: result.data.accountId!,
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
