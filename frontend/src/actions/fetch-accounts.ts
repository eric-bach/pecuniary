'use server';

import { Account } from '../../../backend/src/appsync/api/codegen/appsync';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '../../../backend/src/appsync/api/queries';

export async function fetchAccounts(): Promise<[Account]> {
  const { data } = await serverClient.graphql({
    query: getAccounts,
  });

  return data.getAccounts.items as [Account];
}
