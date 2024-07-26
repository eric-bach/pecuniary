'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createBankTransaction } from '@/../../backend/src/appsync/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateBankTransactionInput } from '@/../../backend/src/appsync/api/codegen/appsync';
import { bankingSchema } from '@/types/transaction';

export interface CreateBankTransactionFormState {
  errors: {
    accountId?: string[];
    transactionDate?: string[];
    symbol?: string[];
    shares?: string[];
    price?: string[];
    commission?: string[];
    type?: string[];
    _form?: string[];
  };
}

export async function createNewBankTransaction({
  accountId,
  transactionDate,
  payee,
  category,
  amount,
}: CreateBankTransactionInput): Promise<CreateBankTransactionFormState> {
  const result = bankingSchema.safeParse({
    accountId,
    transactionDate: new Date(transactionDate),
    payee,
    category,
    amount: amount.toString(),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
      query: createBankTransaction,
      variables: {
        input: {
          accountId,
          transactionDate: new Date(transactionDate).toISOString().split('T')[0],
          payee,
          category,
          amount,
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
  redirect(`/accounts/${accountId}`);
}
