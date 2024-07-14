'use server';

import { BankTransaction } from '../../../backend/src/appsync/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getBankTransactions } from '../../../backend/src/appsync/api/queries';

export async function fetchBankTransactions(accountId: string): Promise<[BankTransaction]> {
  const { data } = await cookieBasedClient.graphql({
    query: getBankTransactions,
    variables: { accountId },
  });

  return data.getBankTransactions.items as [BankTransaction];
}
