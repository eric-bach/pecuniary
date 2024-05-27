import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '@/../../infrastructure/graphql/api/queries';
import { ManageAccounts } from '@/components/accounts/manage';
import { Account } from '../../../../../../infrastructure/graphql/api/codegen/appsync';

async function fetchAccounts(): Promise<[Account]> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccounts,
  });

  return data.getAccounts;
}

export default async function Accounts() {
  const accounts = await fetchAccounts();
  console.log(accounts);

  return <ManageAccounts accounts={accounts} />;
}
