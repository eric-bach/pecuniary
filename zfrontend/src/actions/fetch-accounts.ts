'use server';

import { Account } from '../../../infrastructure/graphql/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '../../../infrastructure/graphql/api/queries';

export async function fetchAccounts(): Promise<[Account]> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccounts,
  });

  return data.getAccounts.items as [Account];
}
