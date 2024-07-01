'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenAccount } from '@/hooks/use-open-account';
import { useConfirm } from '@/hooks/use-confirm';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { deleteExistingAccount } from '@/actions';

type ActionsProps = {
  account: Account;
};

export const Actions = ({ account }: ActionsProps) => {
  const { onOpen } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'You are about to delete this account.');

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      await deleteExistingAccount(account.accountId);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
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
