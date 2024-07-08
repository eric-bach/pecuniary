'use client';

import { useMountedState } from 'react-use';

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet';
import NewAccountSheet from '@/features/accounts/components/new-account-sheet';
import NewInvestmentTransactionSheet from '@/features/investment-transactions/components/new-transaction-sheet';
import NewBankingTransactionSheet from '@/features/banking-transactions/components/new-transaction-sheet';
import EditBankTransactionSheet from '@/features/banking-transactions/components/edit-transaction-sheet';

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <EditAccountSheet />
      <NewAccountSheet />

      <NewBankingTransactionSheet />
      <EditBankTransactionSheet />

      <NewInvestmentTransactionSheet />
    </>
  );
};
