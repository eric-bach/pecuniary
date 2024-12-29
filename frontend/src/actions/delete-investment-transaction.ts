'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { deleteInvestmentTransaction } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';

interface DeleteInvestmentTransactionFormState {
  errors: {
    transactionId?: string[];
    _form?: string[];
  };
}

export async function deleteExistingInvestmentTransaction(
  transaction: InvestmentTransaction
): Promise<DeleteInvestmentTransactionFormState> {
  console.log('deleteExistingInvestmentTransaction', transaction);

  try {
    await serverClient.graphql({
      query: deleteInvestmentTransaction,
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
