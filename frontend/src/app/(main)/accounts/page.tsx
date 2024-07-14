import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import ManageAccounts from '@/features/accounts/manage-accounts';
import { getAccounts } from '@/../../backend/src/appsync/api/queries';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';

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
