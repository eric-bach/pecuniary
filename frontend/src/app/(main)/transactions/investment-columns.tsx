'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InvestmentTransaction } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { Actions } from '@/app/(main)/transactions/actions';
import { Checkbox } from '@/components/ui/checkbox';

export const investmentColumns: ColumnDef<InvestmentTransaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'transactionDate',
    header: 'Date',
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'shares',
    header: 'Shres',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'commission',
    header: 'commission',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      const formattedDate = date.toLocaleString();
      return <div>{formattedDate}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <Actions transaction={row.original} />;
    },
  },
];
