'use client';

import { useOpenPayee } from '@/hooks/use-open-payee';
import PayeeForm from './payee-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { schema } from '@/types/payee';
import * as z from 'zod';
import { useState } from 'react';
import { editExistingPayee } from '@/actions';
import { useToast } from '@/components/ui/use-toast';

const EditPayeeSheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose, payee } = useOpenPayee();
  const [isPending, setPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    const response = await editExistingPayee({
      pk: values.pk!,
      name: values.name,
    });

    onClose();
    setPending(false);

    if (response?.errors) {
      toast({ title: 'Failed!', description: 'Payee could not be updated' });
    } else {
      toast({ title: 'Success!', description: 'Payee was successfully updated' });
    }
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
