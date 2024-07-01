'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import * as z from 'zod';
import { schema } from './account-form';
import AccountForm from './account-form';
import { useNewAccount } from '@/hooks/use-new-account';
import { createNewAccount } from '@/actions';

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await createNewAccount(values);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Create Account</SheetTitle>
          <SheetDescription>Add a new account</SheetDescription>
        </SheetHeader>

        <AccountForm onSubmit={onSubmit} disabled={false} defaultValues={{ name: '', category: '', type: '' }} />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
