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
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditAccountSheet = () => {
  const { isOpen, onClose, account } = useOpenAccount();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<EditAccountFormState>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExistingAccount,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Account updated successfully 🎉', {
        id: 'update-account',
      });

      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to update account', {
        id: 'update-account',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);

    const data = {
      accountId: values.accountId!,
      name: values.name,
      category: values.category,
      type: values.type,
      createdAt: values.createdAt,
    };

    mutation.mutate(data);
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
