'use client';
import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import { ExportIcon } from '@/components/icons/accounts/export-icon';
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon';
import { UsersIcon } from '@/components/icons/breadcrumb/users-icon';
import { TableData, TableWrapper } from './table';
import { AddAccount } from './add-account';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

interface ManageAccountsProps {
  accounts: [Account];
}

export const ManageAccounts: React.FC<ManageAccountsProps> = ({ accounts }) => {
  const tableData: TableData = {
    columns: [
      { name: 'Name', uid: 'name' },
      { name: 'Type', uid: 'type' },
      { name: 'Created At', uid: 'createdAt' },
    ],
    accounts,
  };

  return (
    <div className='my-14 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4'>
      <ul className='flex'>
        <li className='flex gap-2'>
          <HouseIcon />
          <Link href={'/'}>
            <span>Home</span>
          </Link>
          <span> / </span>{' '}
        </li>
        <li className='flex gap-2'>
          <UsersIcon />
          <span>Accounts</span>
          <span> / </span>{' '}
        </li>
        <li className='flex gap-2'>
          <span>List</span>
        </li>
      </ul>
      <h3 className='text-xl font-semibold'>All Accounts</h3>
      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
          <Input classNames={{ input: 'w-full', mainWrapper: 'w-full' }} placeholder='Search accounts' />
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <AddAccount />
          <Button color='primary' startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className='max-w-[95rem] mx-auto w-full'>
        <TableWrapper {...tableData} />
      </div>
    </div>
  );
};
