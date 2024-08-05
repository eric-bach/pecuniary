'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AccountForm from './account-form';
import * as z from 'zod';
import { editExistingAccount } from '@/actions';
import { useOpenAccount } from '@/hooks/use-open-account';
import { schema } from '@/types/account';
import { toast } from 'sonner';
import { useState } from 'react';
import { EditAccountFormState } from '@/actions/edit-account';

const EditAccountSheet = () => {
  const { isOpen, onClose, account } = useOpenAccount();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<EditAccountFormState>();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);

    const data = {
      accountId: values.accountId!,
      name: values.name,
      category: values.category,
      type: values.type,
      createdAt: values.createdAt,
    };

    const response = await editExistingAccount(data);

    if (response?.errors) {
      setResult(response);

      toast.error('Error!', { description: Object.values(response.errors).join('\n') });

      return;
    }

    onClose();
    setIsPending(false);

    toast.success('Success!', { description: 'Account was successfully updated' });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit account</SheetDescription>
          </SheetHeader>

          <AccountForm account={account} onSubmit={onSubmit} disabled={isPending} defaultValues={account} />

          {result?.errors && (
            <div className='text-red-500 text-sm'>
              {Object.values(result.errors).map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
