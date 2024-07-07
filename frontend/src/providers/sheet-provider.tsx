'use client';

import { useMountedState } from 'react-use';

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet';
import NewAccountSheet from '@/features/accounts/components/new-account-sheet';
import NewInvestmentTransactionSheet from '@/features/transactions/components/new-investment-transaction-sheet';

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <EditAccountSheet />
      <NewAccountSheet />

      <NewInvestmentTransactionSheet />
    </>
  );
};
