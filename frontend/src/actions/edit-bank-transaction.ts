'use server';

import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { updateBankTransaction } from '../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateBankTransactionInput } from '../../../infrastructure/graphql/api/codegen/appsync';
import { bankingSchema } from '@/types/transaction';

interface EditBankTransactionFormState {
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

export async function editExistingBankTransaction({
  pk,
  createdAt,
  transactionDate,
  payee,
  category,
  amount,
}: UpdateBankTransactionInput): Promise<EditBankTransactionFormState> {
  const result = bankingSchema.safeParse({
    pk,
    createdAt,
    transactionDate,
    payee,
    category,
    amount,
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  let data;
  try {
    data = await cookieBasedClient.graphql({
      query: updateBankTransaction,
      variables: {
        input: {
          pk: `TRANS#${result.data.accountId}`,
          // TODO Fix this
          // @ts-ignore
          createdAt: result.data.createdAt,
          // @ts-ignore
          transactionDate: result.data.transactionDate,
          // @ts-ignore
          type: result.data.type,
          // @ts-ignore
          payee: result.data.payee,
          // @ts-ignore
          category: result.data.category,
          // @ts-ignore
          amount: result.data.amount,
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
