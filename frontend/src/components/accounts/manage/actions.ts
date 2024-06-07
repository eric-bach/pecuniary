'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account, Aggregates } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { createAccount, deleteAccount } from '@/../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';

interface Props {
  name: string;
  type: string;
}

export async function createNewAccount({ name, type }: Props): Promise<Account> {
  const { data } = await cookieBasedClient.graphql({
    query: createAccount,
    variables: {
      input: {
        name,
        type,
      },
    },
  });

  revalidatePath('/accounts/manage');

  return data.createAccount;
}

export async function deleteExistingAccount(accountId: String): Promise<Aggregates> {
  const { data } = await cookieBasedClient.graphql({
    query: deleteAccount,
    variables: {
      accountId,
    },
  });

  revalidatePath('/accounts/manage');

  return data.deleteAccount;
}
