'use client';

import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenAccount } from '@/hooks/use-open-account';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { deleteExistingAccount } from '@/actions';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DeleteItem from '@/components/delete-item';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ActionsProps = {
  account: Account;
};

export const Actions = ({ account }: ActionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);

  const router = useRouter();
  const { onOpen } = useOpenAccount();

  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: deleteExistingAccount,
    onSuccess: async () => {
      setPending(false);
      handleClose();

      toast.success('Account deleted successfully 🎉', {
        id: 'delete-account',
      });

      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      setPending(false);

      toast.error('Failed to delete account', {
        id: 'delete-account',
      });
    },
  });

  const handleConfirm = async () => {
    setPending(true);

    toast.loading('Deleting account...', { id: 'delete-account' });

    mutation.mutate(account.accountId);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <>
      <DeleteItem
        isOpen={isOpen}
        dialogTitle={`Are you sure you want to delete this account?`}
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
          <DropdownMenuItem onClick={() => router.push(`/accounts/${account.accountId}`)}>
            <Eye className='mr-2 size-4' />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onOpen(account)}>
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
