'use server';

import { BankTransaction } from '../../../infrastructure/graphql/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getBankTransactions } from '../../../infrastructure/graphql/api/queries';

export async function fetchBankTransactions(accountId: string): Promise<[BankTransaction]> {
  const { data } = await cookieBasedClient.graphql({
    query: getBankTransactions,
    variables: { accountId },
  });

  return data.getBankTransactions.items as [BankTransaction];
}
