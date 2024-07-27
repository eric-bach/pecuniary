'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { deleteTransaction } from '../../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BankTransaction, InvestmentTransaction } from '../../../backend/src/appsync/api/codegen/appsync';

interface DeleteTransactionFormState {
  errors: {
    transactionId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingTransaction(transaction: BankTransaction | InvestmentTransaction): Promise<DeleteTransactionFormState> {
  console.log('deleteExistingTransaction', transaction);

  try {
    await serverClient.graphql({
      query: deleteTransaction,
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
