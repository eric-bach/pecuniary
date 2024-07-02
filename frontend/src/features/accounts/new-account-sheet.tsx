'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import AccountForm from './account-form';
import { useNewAccount } from '@/hooks/use-new-account';
import { createNewAccount } from '@/actions';
import { schema } from '@/types/account';
import { useToast } from '@/components/ui/use-toast';

const NewAccountSheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose } = useNewAccount();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await createNewAccount(values);
    onClose();

    toast({ title: 'Success!', description: 'Account was successfully created' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Create Account</SheetTitle>
          <SheetDescription>Add a new account</SheetDescription>
        </SheetHeader>

        <AccountForm
          onSubmit={onSubmit}
          disabled={false}
          defaultValues={{ accountId: '', name: '', category: '', type: '', createdAt: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
