'use client';

import React from 'react';
import { Account } from '@/../../infrastructure/graphql/api/codegen/appsync';

interface DisplayAccountProps {
  account: Account;
}

export default function DisplayAccount({ account }: DisplayAccountProps) {
  console.log(account);

  return (
    <div>
      <h1>{account.name}</h1>
      <div>
        <p>{account.accountId}</p>
        <p>{account.category}</p>
        <p>{account.type}</p>
      </div>
    </div>
  );
}
