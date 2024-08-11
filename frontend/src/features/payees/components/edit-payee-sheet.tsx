'use client';

import { useOpenPayee } from '@/hooks/use-open-payee';
import PayeeForm from './payee-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { schema } from '@/types/payee';
import * as z from 'zod';
import { useState } from 'react';
import { editExistingPayee } from '@/actions';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditPayeeSheet = () => {
  const { isOpen, onClose, payee } = useOpenPayee();
  const [isPending, setPending] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExistingPayee,
    onSuccess: async () => {
      setPending(false);
      onClose();

      toast.success('Payee updated successfully', {
        id: 'update-payee',
        duration: 5000,
        description: 'The payee has been updated',
      });

      await queryClient.invalidateQueries({ queryKey: ['payees'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to update payee', {
        id: 'update-payee',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    toast.loading('Updating payee...', { id: 'update-payee' });

    mutation.mutate({ pk: values.pk!, name: values.name });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Payee</DialogTitle>
        </DialogHeader>

        <PayeeForm onSubmit={onSubmit} onClose={onClose} disabled={isPending} defaultValues={payee} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPayeeSheet;
