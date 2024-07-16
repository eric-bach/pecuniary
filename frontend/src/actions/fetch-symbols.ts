'use server';

import { Symbol } from '../../../backend/src/appsync/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getSymbols } from '../../../backend/src/appsync/api/queries';

export async function fetchSymbols(): Promise<[Symbol]> {
  const { data } = await cookieBasedClient.graphql({
    query: getSymbols,
  });

  return data.getSymbols.items as [Symbol];
}
