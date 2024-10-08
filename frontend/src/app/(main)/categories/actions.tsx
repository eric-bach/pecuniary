'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Category } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOpenCategory } from '@/hooks/use-open-category';
import DeleteItem from '@/components/delete-item';

type ActionsProps = {
  category: Category;
};

export const Actions = ({ category }: ActionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);

  const { onOpen } = useOpenCategory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setPending(true);

    // TODO Delete Category, what to do with associated transactions?
    //await deleteExistingAccount(payee.accountId);

    setPending(false);
    handleClose();

    toast.warning('Error!', { description: 'Not implemented yet' });
    // toast.success('Success!', { description: 'Category was successfully deleted' });
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <>
      <DeleteItem
        isOpen={isOpen}
        dialogTitle={`Are you sure you want to delete this category?`}
        disabled={isPending}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => onOpen(category)}>
            <Edit className='mr-2 size-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className='mr-2 size-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
