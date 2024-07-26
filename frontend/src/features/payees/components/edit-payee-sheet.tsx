'use client';

import { useOpenPayee } from '@/hooks/use-open-payee';
import PayeeForm from './payee-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { schema } from '@/types/payee';
import * as z from 'zod';
import { useState } from 'react';
import { editExistingPayee } from '@/actions';

const EditPayeeSheet = () => {
  const { isOpen, onClose, payee } = useOpenPayee();
  const [isPending, setPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    await editExistingPayee({
      pk: payee?.pk!,
      name: values.name,
    });

    onClose();
    setPending(false);
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
