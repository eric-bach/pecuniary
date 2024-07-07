'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { deleteTransaction } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Transaction } from '../../../infrastructure/graphql/api/codegen/appsync';

interface DeleteTransactionFormState {
  errors: {
    transactionId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingTransaction(transaction: Transaction): Promise<DeleteTransactionFormState> {
  try {
    await cookieBasedClient.graphql({
      query: deleteTransaction,
      variables: {
        deleteTransactionInput: {
          pk: transaction.pk,
          createdAt: transaction.createdAt,
          symbol: transaction.symbol,
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
