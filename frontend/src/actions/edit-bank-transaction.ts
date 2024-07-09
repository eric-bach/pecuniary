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
  transactionId,
  createdAt,
  transactionDate,
  payee,
  category,
  amount,
}: UpdateBankTransactionInput): Promise<EditBankTransactionFormState> {
  const result = bankingSchema.safeParse({
    accountId: pk.split('#')[1],
    transactionId,
    createdAt,
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
    data = await cookieBasedClient.graphql({
      query: updateBankTransaction,
      variables: {
        input: {
          pk: `trans#${result.data.accountId}`,
          createdAt: result.data.createdAt!,
          transactionId: result.data.transactionId!,
          transactionDate: new Date(transactionDate).toISOString().split('T')[0],
          payee: result.data.payee,
          category: result.data.category,
          amount: parseFloat(result.data.amount),
        },
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { errors: { _form: [err.message] } };
    } else {
      console.log(err);
      return { errors: { _form: ['An unknown error occurred'] } };
    }
  }

  revalidatePath('/', 'layout');
  redirect(`/accounts/${result.data.accountId}`);
}
