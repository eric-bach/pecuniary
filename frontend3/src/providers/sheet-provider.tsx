'use client';

import { useMountedState } from 'react-use';

import EditAccountSheet from '@/components/accounts/edit-account-sheet';
import NewAccountSheet from '@/components/accounts/new-account-sheet';

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
