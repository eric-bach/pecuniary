'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { deleteTransaction } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BankTransaction, InvestmentTransaction } from '../../../infrastructure/graphql/api/codegen/appsync';

interface DeleteTransactionFormState {
  errors: {
    transactionId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingTransaction(transaction: BankTransaction | InvestmentTransaction): Promise<DeleteTransactionFormState> {
  try {
    await cookieBasedClient.graphql({
      query: deleteTransaction,
      variables: {
        input: {
          pk: transaction.pk,
          createdAt: transaction.createdAt,
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
