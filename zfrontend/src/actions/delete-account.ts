'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { deleteAccount } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface DeleteAccountFormState {
  errors: {
    accountId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingAccount(formState: DeleteAccountFormState, formData: FormData): Promise<DeleteAccountFormState> {
  try {
    await cookieBasedClient.graphql({
      query: deleteAccount,
      variables: {
        accountId: formData.get('accountId') as string,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ['An unknown error occurred'] } };
    }
  }

  revalidatePath('/accounts/manage');
  redirect('/accounts/manage');
}
