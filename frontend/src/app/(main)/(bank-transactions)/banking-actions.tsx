'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { BankTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { deleteExistingBankTransaction } from '@/actions';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteItem from '@/components/delete-item';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type TransactionsProps = {
  transaction: BankTransaction;
};

export const Actions = ({ transaction }: TransactionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { onOpen: onBankingOpen } = useOpenBankTransaction();

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: deleteExistingBankTransaction,
    onSuccess: async () => {
      setPending(false);
      handleClose();

      toast.success('Transaction deleted successfully 🎉', {
        id: 'delete-transaction',
      });

      await queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to delete transaction', {
        id: 'delete-bank-transaction',
      });
    },
  });

  const handleConfirm = async () => {
    setPending(true);

    toast.loading('Deleting transaction...', { id: 'delete-bank-transaction' });

    mutation.mutate(transaction);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    onBankingOpen(transaction);
  };

  return (
    <>
      <DeleteItem
        isOpen={isOpen}
        disabled={isPending}
        dialogTitle={`Are you sure you want to delete this transaction?`}
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
          <DropdownMenuItem onClick={() => handleOpen()}>
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