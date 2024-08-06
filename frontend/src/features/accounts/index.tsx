'use client';

import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useNewAccount } from '@/hooks/use-new-account';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/accounts/columns';
import { useQuery } from '@tanstack/react-query';

const Accounts = () => {
  const newAccount = useNewAccount();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => fetch('/api/accounts').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  if (accountsQuery.isFetching) return <div>Loading...</div>;

  const accounts: Account[] = accountsQuery.data;

  return <DataTable filterKey='name' title='Accounts' columns={columns} data={accounts} onClick={newAccount.onOpen} />;
};

export default Accounts;
