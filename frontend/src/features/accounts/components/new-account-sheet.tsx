'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import AccountForm from './account-form';
import { useNewAccount } from '@/hooks/use-new-account';
import { createNewAccount } from '@/actions';
import { schema } from '@/types/account';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateAccountFormState } from '@/actions/create-account';

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<CreateAccountFormState>();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);

    const response = await createNewAccount(values);

    if (response?.errors) {
      setResult(response);

      toast.error('Error!', { description: Object.values(response.errors).join('\n') });

      return;
    }

    onClose();
    setIsPending(false);

    toast.success('Success!', { description: 'Account was successfully created' });
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
          disabled={isPending}
          defaultValues={{ accountId: '', name: '', category: '', type: '', createdAt: '' }}
        />

        {result?.errors && (
          <div className='text-red-500 text-sm'>
            {Object.values(result.errors).map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
