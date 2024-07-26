'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

    // TODO Handle error
    const result = await createNewPayee(values.name);

    onClose();
    setPending(false);
    toast({ title: 'Success!', description: 'Payee was successfully created' });
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
