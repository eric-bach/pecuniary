'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { getAccount } from '@/../../../infrastructure/graphql/api/queries';

export async function getExistingAccount(accountId: string): Promise<Account> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccount,
    variables: {
      accountId,
    },
  });

  return data.getAccount;
}
