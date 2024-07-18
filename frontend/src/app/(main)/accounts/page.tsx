import ManageAccounts from '@/features/accounts/manage-accounts';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchAccounts } from '@/actions';

export default async function Accounts() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManageAccounts />
    </HydrationBoundary>
  );
}
