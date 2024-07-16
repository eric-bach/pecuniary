'use server';

import { Category } from '../../../backend/src/appsync/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getCategories } from '../../../backend/src/appsync/api/queries';

export async function fetchCategories(): Promise<[Category]> {
  const { data } = await cookieBasedClient.graphql({
    query: getCategories,
  });

  return data.getCategories.items as [Category];
}
