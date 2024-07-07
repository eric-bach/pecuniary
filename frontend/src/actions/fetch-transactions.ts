'use server';

import { Transaction } from '../../../infrastructure/graphql/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getTransactions } from '../../../infrastructure/graphql/api/queries';

export async function fetchTransactions(accountId: string): Promise<[Transaction]> {
  const { data } = await cookieBasedClient.graphql({
    query: getTransactions,
    variables: { accountId },
  });

  return data.getTransactions.items as [Transaction];
}
