'use client';

import React from 'react';
import { Account } from '@/../../infrastructure/graphql/api/codegen/appsync';

interface DisplayAccountProps {
  account: Account;
  children: React.ReactNode;
}

export default function DisplayAccount({ children, account }: DisplayAccountProps) {
  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <div className='flex flex-col space-y-1 5 p-6 gap-y-2 justify-between'>
        <h3 className='text-2xl font-semibold leading-none tracking-tight text-xl-line-clamp-1'>{account.name}</h3>
        <p className='text-sm text-muted-foreground'>{account.type}</p>
      </div>

      {children}
    </div>
  );
}
