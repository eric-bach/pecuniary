'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { schema } from '@/types/payee';
import { createNewPayee } from '@/actions/index';
import * as z from 'zod';
import PayeeForm from './payee-form';
import { useNewPayee } from '@/hooks/use-new-payee';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPayeeSheet = () => {
  const [isPending, setPending] = useState<boolean>(false);
  const { isOpen, onClose } = useNewPayee();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewPayee,
    onSuccess: async () => {
      setPending(false);
      onClose();

      toast.success('Payee created successfully', {
        id: 'create-payee',
        duration: 5000,
        description: 'Your payee has been created',
      });

      await queryClient.invalidateQueries({ queryKey: ['payees'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to create payee', {
        id: 'create-payee',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    toast.loading('Creating payee...', { id: 'create-payee' });

    mutation.mutate(values.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payee</DialogTitle>
        </DialogHeader>

        <PayeeForm onSubmit={onSubmit} onClose={onClose} disabled={isPending} defaultValues={{ name: '' }} />
      </DialogContent>
    </Dialog>
  );
};

export default NewPayeeSheet;
