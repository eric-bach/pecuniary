'use client';

import { useOpenCategory } from '@/hooks/use-open-category';
import CategoryForm from './category-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { schema } from '@/types/category';
import * as z from 'zod';
import { useState } from 'react';
import { editExistingCategory } from '@/actions';
import { useToast } from '@/components/ui/use-toast';

const EditCategorySheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose, category } = useOpenCategory();
  const [isPending, setPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    const response = await editExistingCategory({
      pk: values.pk!,
      name: values.name,
    });

    onClose();
    setPending(false);

    if (response?.errors) {
      toast({ title: 'Failed!', description: 'Category could not be updated' });
    } else {
      toast({ title: 'Success!', description: 'Category was successfully updated' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <CategoryForm onSubmit={onSubmit} onClose={onClose} disabled={isPending} defaultValues={category} />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategorySheet;
