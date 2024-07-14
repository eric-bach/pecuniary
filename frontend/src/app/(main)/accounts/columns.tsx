'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { Actions } from '@/app/(main)/accounts/actions';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Account>[] = [
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
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'type',
    header: 'Type',
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
      return <Actions account={row.original} />;
    },
  },
];
