'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { createBankTransaction } from '@/../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateBankTransactionInput } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { bankingSchema } from '@/types/transaction';

interface CreateBankTransactionFormState {
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

  console.log('Create Transaction Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
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
    console.log(err);

    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      return { errors: { _form: ['An unknown error occurred'] } };
    }
  }

  revalidatePath('/', 'layout');
  redirect(`/accounts/${accountId}`);
}
