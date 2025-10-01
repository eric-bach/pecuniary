'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Payee } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOpenPayee } from '@/hooks/use-open-payee';
import DeleteItem from '@/components/delete-item';

type ActionsProps = {
  payee: Payee;
};

export const Actions = ({ payee }: ActionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);

  const { onOpen } = useOpenPayee();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setPending(true);

    // TODO Delete Payee, what to do with associated transactions?
    //await deleteExistingAccount(payee.accountId);

    setPending(false);
    handleClose();

    toast.warning('Error!', { description: 'Not implemented yet' });
    //toast.success('Success!', { description: 'Payee was successfully deleted' });
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <>
      <DeleteItem
        isOpen={isOpen}
        dialogTitle={`Are you sure you want to delete this payee?`}
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
          <DropdownMenuItem onClick={() => onOpen(payee)}>
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
