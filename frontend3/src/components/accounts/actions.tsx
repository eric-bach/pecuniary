'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';
import { useOpenAccount } from '@/hooks/use-open-account';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
// import { useConfirm } from '@/hooks/use-confirm';

type ActionsProps = {
  account: Account;
};

export const Actions = ({ account }: ActionsProps) => {
  // const deleteMutation = useDeleteAccount(id);
  const { onOpen } = useOpenAccount();

  // const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'You are about to delete this account.');

  // const handleDelete = async () => {
  //   const ok = await confirm();

  //   if (ok) {
  //     deleteMutation.mutate();
  //   }
  // };

  return (
    <>
      {/* <ConfirmDialog /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          {/* <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}> */}
          <DropdownMenuItem onClick={() => onOpen(account)}>
            <Edit className='mr-2 size-4' />
            Edit
          </DropdownMenuItem>
          {/* 
          <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
            <Trash className='mr-2 size-4' />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
