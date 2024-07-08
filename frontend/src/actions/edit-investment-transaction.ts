'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { updateInvestmentTransaction } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateInvestmentTransactionInput } from '../../../infrastructure/graphql/api/codegen/appsync';
import { investmentSchema } from '@/types/transaction';

interface EditInvestmentTransactionFormState {
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
  pk,
  createdAt,
  transactionDate,
  symbol,
  shares,
  price,
  commission,
  type,
}: UpdateInvestmentTransactionInput): Promise<EditInvestmentTransactionFormState> {
  const result = investmentSchema.safeParse({
    pk,
    createdAt,
    transactionDate,
    symbol,
    shares,
    price,
    commission,
    type,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: updateInvestmentTransaction,
      variables: {
        input: {
          pk: `TRANS#${result.data.accountId}`,
          // TODO Fix this
          // @ts-ignore
          createdAt: result.data.createdAt,
          // @ts-ignore
          transactionDate: result.data.transactionDate,
          symbol: result.data.symbol,
          type: result.data.type,
          // @ts-ignore
          shares: result.data.shares,
          // @ts-ignore
          price: result.data.price,
          // @ts-ignore
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
