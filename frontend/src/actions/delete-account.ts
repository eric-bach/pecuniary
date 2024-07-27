'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { deleteAccount } from '../../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface DeleteAccountFormState {
  errors: {
    accountId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingAccount(accountId: string): Promise<DeleteAccountFormState> {
  try {
    await serverClient.graphql({
      query: deleteAccount,
      variables: {
        accountId,
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
