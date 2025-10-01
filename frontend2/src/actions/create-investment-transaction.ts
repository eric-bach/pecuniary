'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { createInvestmentTransaction } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateInvestmentTransactionInput } from '@/../../backend/src/appsync/api/codegen/appsync';
import { investmentSchema } from '@/types/transaction';

export interface CreateInvestmentTransactionFormState {
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

export async function createNewInvestmentTransaction({
  accountId,
  transactionDate,
  type,
  symbol,
  shares,
  price,
  commission,
}: CreateInvestmentTransactionInput): Promise<CreateInvestmentTransactionFormState> {
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
    data = await serverClient.graphql({
      query: createInvestmentTransaction,
      variables: {
        input: {
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
