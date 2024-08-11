'use client';

import { useNewAccount } from '@/hooks/use-new-account';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/accounts/columns';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Account } from '../../../../backend/src/appsync/api/codegen/appsync';

const Accounts = () => {
  const newAccount = useNewAccount();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  if (accountsQuery.isFetching) return <Skeleton className='h-6 w-100' />;

  return (
    <DataTable filterKey='name' title='Accounts' columns={columns} data={accountsQuery.data as Account[]} onClick={newAccount.onOpen} />
  );
};

export default Accounts;
