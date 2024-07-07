'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { createTransaction } from '@/../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateTransactionInput } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { investmentSchema } from '@/types/transaction';

interface CreateTransactionFormState {
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

export async function createNewTransaction({
  accountId,
  transactionDate,
  type,
  symbol,
  shares,
  price,
  commission,
}: CreateTransactionInput): Promise<CreateTransactionFormState> {
  const result = investmentSchema.safeParse({
    accountId,
    transactionDate: new Date(transactionDate),
    type,
    symbol,
    shares: shares.toString(),
    price: price.toString(),
    commission: commission.toString(),
  });

  console.log('Create Transaction Result', result);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: createTransaction,
      variables: {
        createTransactionInput: {
          accountId,
          transactionDate: new Date(transactionDate).toISOString().split('T')[0],
          symbol,
          type,
          shares,
          price,
          commission,
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
