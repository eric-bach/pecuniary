'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { createTransaction } from '@/../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateTransactionInput } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { schema } from '@/types/transaction';

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
  symbol,
  shares,
  price,
  commission,
  type,
}: CreateTransactionInput): Promise<CreateTransactionFormState> {
  const result = schema.safeParse({
    accountId,
    transactionDate,
    symbol,
    type,
    shares,
    price,
    commission,
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
          accountId: result.data.accountId,
          // TODO Check this
          transactionDate: result.data.transactionDate.toDateString(),
          symbol: result.data.symbol,
          type: result.data.type,
          shares: result.data.shares,
          price: result.data.price,
          commission: result.data.commission,
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
