'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { schema } from '@/types/category';
import { createNewCategory } from '@/actions/index';
import * as z from 'zod';
import CategoryForm from './category-form';
import { useNewCategory } from '@/hooks/use-new-category';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewCategorySheet = () => {
  const [isPending, setPending] = useState<boolean>(false);
  const { isOpen, onClose } = useNewCategory();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewCategory,
    onSuccess: async () => {
      setPending(false);
      onClose();

      toast.success('Created category successfully 🎉', {
        id: 'create-category',
      });

      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to create category', {
        id: 'create-category',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setPending(true);

    toast.loading('Creating category...', { id: 'create-category' });

    mutation.mutate(values.name);
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
