'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import AccountForm from './account-form';
import { useNewAccount } from '@/hooks/use-new-account';
import { createNewAccount } from '@/actions';
import { schema } from '@/types/account';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewAccount,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Account created successfully', {
        id: 'create-account',
        duration: 5000,
        description: 'Your account has been created',
      });

      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to create account', {
        id: 'create-account',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);

    toast.loading('Creating account...', { id: 'create-account' });

    mutation.mutate(values);
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
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
