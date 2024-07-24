'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { schema } from '@/types/payee';
import { createNewPayee } from '@/actions/index';
import * as z from 'zod';
import PayeeForm from './payee-form';
import { useNewPayee } from '@/hooks/use-new-payee';

const NewPayeeSheet = () => {
  const [isPending, setPending] = useState<boolean>(false);
  const { isOpen, onClose } = useNewPayee();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);
    await createNewPayee(values.name);

    onClose();
    setPending(false);
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