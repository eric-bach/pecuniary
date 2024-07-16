'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BankTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { Actions } from '@/app/(main)/transactions/actions';
import { Checkbox } from '@/components/ui/checkbox';

export const bankingColumns: ColumnDef<BankTransaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transactionDate',
    header: 'Transaction Date',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'payee',
    header: 'Payee',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      // TODO Change this to currency format
      new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(row.getValue('amount')),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <Actions transaction={row.original} />;
    },
  },
];
