'use server';

import { InvestmentTransaction } from '../../../backend/src/appsync/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getInvestmentTransactions } from '../../../backend/src/appsync/api/queries';

export async function fetchInvestmentTransactions(accountId: string): Promise<[InvestmentTransaction]> {
  const { data } = await cookieBasedClient.graphql({
    query: getInvestmentTransactions,
    variables: { accountId },
  });

  return data.getInvestmentTransactions.items as [InvestmentTransaction];
}
