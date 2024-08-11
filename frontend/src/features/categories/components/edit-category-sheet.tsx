'use client';

import { useOpenCategory } from '@/hooks/use-open-category';
import CategoryForm from './category-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { schema } from '@/types/category';
import * as z from 'zod';
import { useState } from 'react';
import { editExistingCategory } from '@/actions';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditCategorySheet = () => {
  const { isOpen, onClose, category } = useOpenCategory();
  const [isPending, setPending] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExistingCategory,
    onSuccess: async () => {
      setPending(false);
      onClose();

      toast.success('Category updated successfully', {
        id: 'update-category',
        duration: 5000,
        description: 'The category has been updated',
      });

      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to update category', {
        id: 'update-category',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    toast.loading('Updating category...', { id: 'update-category' });

    mutation.mutate({ pk: values.pk!, name: values.name });
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
