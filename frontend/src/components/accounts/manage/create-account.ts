'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';
import { createAccount } from '../../../../../infrastructure/graphql/api/queries';

interface Props {
  name: string;
  type: string;
}

export async function create({ name, type }: Props): Promise<Account> {
  const { data } = await cookieBasedClient.graphql({
    query: createAccount,
    variables: {
      input: {
        name,
        type,
      },
    },
  });

  console.log('Created Account', data.createAccount);

  return data.createAccount;
}
