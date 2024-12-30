'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { deleteBankTransaction } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BankTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';

interface DeleteBankTransactionFormState {
  errors: {
    transactionId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingBankTransaction(transaction: BankTransaction): Promise<DeleteBankTransactionFormState> {
  console.log('deleteExistingBankTransaction', transaction);

  try {
    await serverClient.graphql({
      query: deleteBankTransaction,
      variables: {
        input: {
          pk: transaction.pk,
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
  redirect(`/accounts/${transaction.accountId}`);
}
