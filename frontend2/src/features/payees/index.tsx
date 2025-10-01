'use client';

import { DataTable } from '@/components/data-table';
import { Payee } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/payees/columns';
import { useNewPayee } from '@/hooks/use-new-payee';
import { useQuery } from '@tanstack/react-query';

export default function Payees() {
  const newPayee = useNewPayee();

  const payeesQuery = useQuery({
    queryKey: ['payees'],
    queryFn: async () => fetch('/api/payees').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  if (payeesQuery.isPending) return <></>;

  return <DataTable filterKey='name' title='Payees' columns={columns} data={payeesQuery.data as Payee[]} onClick={newPayee.onOpen} />;
}
