'use client';

import { useMountedState } from 'react-use';

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet';
import NewAccountSheet from '@/features/accounts/components/new-account-sheet';
import NewInvestmentTransactionSheet from '@/features/investment-transactions/components/new-transaction-sheet';
import NewBankingTransactionSheet from '@/features/banking-transactions/components/new-transaction-sheet';
import EditBankTransactionSheet from '@/features/banking-transactions/components/edit-transaction-sheet';
import EditInvestmentTransactionSheet from '@/features/investment-transactions/components/edit-transaction-sheet';
import NewPayeeSheet from '@/features/payees/components/new-payee-sheet';
import EditPayeeSheet from '@/features/payees/components/edit-payee-sheet';
import NewCategorySheet from '@/features/categories/components/new-category-sheet';
import EditCategorySheet from '@/features/categories/components/edit-category-sheet';

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
      <EditInvestmentTransactionSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewPayeeSheet />
      <EditPayeeSheet />
    </>
  );
};
