'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account } from '@/../../../backend/src/appsync/api/codegen/appsync';
import { getAccount } from '@/../../../backend/src/appsync/api/queries';

export async function fetchAccount(accountId: string): Promise<Account> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccount,
    variables: {
      accountId,
    },
  });

  return data.getAccount;
}
