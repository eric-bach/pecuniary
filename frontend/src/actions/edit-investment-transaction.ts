'use server';

import { serverClient } from '@/utils/amplifyServerUtils';
import { updateInvestmentTransaction } from './api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateInvestmentTransactionInput } from '@/../../backend/src/appsync/api/codegen/appsync';
import { investmentSchema } from '@/types/transaction';

export interface EditInvestmentTransactionFormState {
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

export async function editExistingInvestmentTransaction({
  accountId,
  transactionId,
  transactionDate,
  symbol,
  shares,
  price,
  commission,
  type,
}: UpdateInvestmentTransactionInput): Promise<EditInvestmentTransactionFormState> {
  const result = investmentSchema.safeParse({
    accountId,
    transactionId,
    transactionDate: new Date(transactionDate),
    symbol,
    shares: shares.toString(),
    price: price.toString(),
    commission: commission.toString(),
    type,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await serverClient.graphql({
      query: updateInvestmentTransaction,
      variables: {
        input: {
          accountId: result.data.accountId!,
          transactionId: result.data.transactionId!,
          transactionDate: new Date(transactionDate).toISOString().split('T')[0],
          type: result.data.type,
          symbol: result.data.symbol,
          shares: parseFloat(result.data.shares),
          price: parseFloat(result.data.price),
          commission: parseFloat(result.data.commission),
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

  revalidatePath(`'/'`, 'layout');
  redirect(`/accounts/${result.data.accountId}`);
}
