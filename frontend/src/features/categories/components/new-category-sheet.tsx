'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { schema } from '@/types/category';
import { createNewCategory } from '@/actions/index';
import * as z from 'zod';
import CategoryForm from './category-form';
import { useNewCategory } from '@/hooks/use-new-category';
import { useToast } from '@/components/ui/use-toast';

const NewCategorySheet = () => {
  const { toast } = useToast();
  const [isPending, setPending] = useState<boolean>(false);
  const { isOpen, onClose } = useNewCategory();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    const response = await createNewCategory(values.name);

    onClose();
    setPending(false);

    if (response?.errors) {
      toast({ title: 'Failed!', description: 'Category could not be created' });
    } else {
      toast({ title: 'Success!', description: 'Category was successfully created' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payee</DialogTitle>
        </DialogHeader>

        <CategoryForm onSubmit={onSubmit} onClose={onClose} disabled={isPending} defaultValues={{ name: '' }} />
      </DialogContent>
    </Dialog>
  );
};

export default NewCategorySheet;
