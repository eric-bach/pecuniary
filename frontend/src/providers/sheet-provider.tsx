'use client';

import { useMountedState } from 'react-use';

import EditAccountSheet from '@/features/accounts/edit-account-sheet';
import NewAccountSheet from '@/features/accounts/new-account-sheet';

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <EditAccountSheet />
      <NewAccountSheet />
    </>
  );
};
