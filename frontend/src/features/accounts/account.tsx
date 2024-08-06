'use client';

import React from 'react';
import { Account, BankTransaction, InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BankingTransactions from '../banking-transactions';
import InvestmentTransactions from '../investment-transactions';

export default function DisplayAccount() {
  const params = useParams<{ accountId: string }>();

  const accountId = params.accountId;

  const accountQuery = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => fetch('/api/account?' + new URLSearchParams({ accountId })).then((res) => res.json()),
  });

  const bankTransactionsQuery = useQuery({
    queryKey: ['bank-transactions', accountId],
    queryFn: () => fetch('/api/bank-transactions?' + new URLSearchParams({ accountId })).then((res) => res.json()),
  });

  const investmentTransactionsQuery = useQuery({
    queryKey: ['investment-transactions', accountId],
    queryFn: () => fetch('/api/investment-transactions?' + new URLSearchParams({ accountId })).then((res) => res.json()),
  });

  // TODO Fix this loading page
  if (accountQuery.isPending || bankTransactionsQuery.isPending || investmentTransactionsQuery.isPending) return <div>Loading...</div>;

  const account = accountQuery.data as Account;
  const bankTransactions = bankTransactionsQuery.data.items as [BankTransaction];
  const investmentTransactions = investmentTransactionsQuery.data.items as [InvestmentTransaction];

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <div className='flex flex-col space-y-1 5 p-6 gap-y-2 justify-between'>
        <h3 className='text-2xl font-semibold leading-none tracking-tight text-xl-line-clamp-1'>{account.name}</h3>
        <p className='text-sm text-muted-foreground'>{account.type}</p>
      </div>

      {(account.category.toLowerCase() === 'banking' || account.category.toLowerCase() === 'credit card') && (
        <BankingTransactions accountId={accountId} transactions={bankTransactions as [BankTransaction]} />
      )}

      {account.category.toLowerCase() === 'investment' && (
        <InvestmentTransactions accountId={accountId} transactions={investmentTransactions as [InvestmentTransaction]} />
      )}
    </div>
  );
}
