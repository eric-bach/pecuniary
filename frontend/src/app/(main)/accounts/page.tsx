import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import ManageAccounts from '@/features/accounts/manage-accounts';
import { getAccounts } from '@/../../backend/src/appsync/api/queries';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Posts from './accounts';

async function fetchAccounts(): Promise<[Account]> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccounts,
  });

  return data.getAccounts.items as [Account];
}

export default async function Accounts() {
  // const accounts = await fetchAccounts();
  // return <ManageAccounts accounts={accounts} />;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}
