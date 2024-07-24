'use client';

import { DataTable } from '@/components/data-table';
import { Payee } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/payees/columns';
import { useNewPayee } from '@/hooks/use-new-payee';

interface PayeesListProps {
  payees: Payee[];
}

export default function Payees({ payees }: PayeesListProps) {
  const newPayee = useNewPayee();

  return <DataTable filterKey='name' title='Payees' columns={columns} data={payees} onClick={newPayee.onOpen} />;
}
