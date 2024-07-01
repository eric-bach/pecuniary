import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '@/../../infrastructure/graphql/api/queries';
import ManageAccounts from '@/components/accounts/manage-accounts';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

async function fetchAccounts(): Promise<[Account]> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccounts,
  });

  return data.getAccounts.items as [Account];
}

export default async function Accounts() {
  const accounts = await fetchAccounts();

  return <ManageAccounts accounts={accounts} />;
}
