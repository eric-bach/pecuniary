'use server';

import { Payee } from '../../../backend/src/appsync/api/codegen/appsync';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getPayees } from '../../../backend/src/appsync/api/queries';

export async function fetchPayees(): Promise<Payee[]> {
  const { data } = await serverClient.graphql({
    query: getPayees,
  });

  return data.getPayees.items as Payee[];
}
