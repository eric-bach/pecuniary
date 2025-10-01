'use client';

import { ColumnDef } from '@tanstack/react-table';
import { InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { Actions } from '@/app/(main)/(investment-transactions)/investment-actions';
import { Checkbox } from '@/components/ui/checkbox';

export const investmentColumns: ColumnDef<InvestmentTransaction>[] = [
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
    header: 'Date',
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'shares',
    header: 'Shres',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) =>
      // TODO Change this to currency format
      new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(row.getValue('price')),
  },
  {
    accessorKey: 'commission',
    header: 'commission',
    cell: ({ row }) =>
      // TODO Change this to currency format
      new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(row.getValue('commission')),
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
