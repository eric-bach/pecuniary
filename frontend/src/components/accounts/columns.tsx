'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { Actions } from './actions';

export const columns: ColumnDef<Account>[] = [
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
