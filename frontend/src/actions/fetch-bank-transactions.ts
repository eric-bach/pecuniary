'use server';

import { BankTransaction } from '../../../backend/src/appsync/api/codegen/appsync';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getBankTransactions } from '../../../backend/src/appsync/api/queries';

export async function fetchBankTransactions(accountId: string): Promise<[BankTransaction]> {
  const { data } = await serverClient.graphql({
    query: getBankTransactions,
    variables: { accountId },
  });

  return data.getBankTransactions.items as [BankTransaction];
}
