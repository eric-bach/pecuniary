'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Account } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/transactions/columns';

interface DisplayAccountProps {
  account: Account;
}

const transactions = [{ name: 'Transaction 1', type: 'Deposit', amount: 100, date: '2021-10-10' }];

export default function DisplayAccount({ account }: DisplayAccountProps) {
  console.log(account);

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl-line-clamp-1'>{account.name}</CardTitle>
          <CardDescription>{account.type}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Date Filter</p>
          <p>Transactions</p>

          <DataTable filterKey='name' columns={columns} data={transactions} onDelete={(row) => console.log(row)} />
        </CardContent>
      </Card>
    </div>
  );
}
