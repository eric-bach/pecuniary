'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { schema } from '@/types/payee';
import { createNewPayee } from '@/actions/index';
import * as z from 'zod';
import PayeeForm from './payee-form';
import { useNewPayee } from '@/hooks/use-new-payee';
import { useToast } from '@/components/ui/use-toast';

const NewPayeeSheet = () => {
  const { toast } = useToast();
  const [isPending, setPending] = useState<boolean>(false);
  const { isOpen, onClose } = useNewPayee();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    const response = await createNewPayee(values.name);

    onClose();
    setPending(false);

    if (response?.errors) {
      toast({ title: 'Failed!', description: 'Payee could not be created' });
    } else {
      toast({ title: 'Success!', description: 'Payee was successfully created' });
    }
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
