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

type ActionsProps = {
  account: Account;
};

export const Actions = ({ account }: ActionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isPending, setPending] = useState<boolean>(false);

  const router = useRouter();
  const { onOpen } = useOpenAccount();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setPending(true);
    await deleteExistingAccount(account.accountId);

    // TODO Handle if delete fails

    setPending(false);
    handleClose();
    toast.success('Success!', { description: 'Account was successfully deleted' });
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
