'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenAccount } from '@/hooks/use-open-account';
import { Account } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { deleteExistingAccount } from '@/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

type ActionsProps = {
  account: Account;
};

export const Actions = ({ account }: ActionsProps) => {
  const { toast } = useToast();
  const { onOpen } = useOpenAccount();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');

  const handleClose = () => {
    setOpen(false);
    setDeleteConfirm('');
  };

  const handleConfirm = async () => {
    await deleteExistingAccount(account.accountId);

    handleClose();

    toast({ title: 'Success!', description: 'Account was successfully deleted' });
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleInputChange = (event: any) => {
    setDeleteConfirm(event.target.value);
  };

  const handleDelete = () => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this account?</DialogTitle>
            <DialogDescription>To confirm deletion, enter "delete" below</DialogDescription>
          </DialogHeader>
          <Input type='text' value={deleteConfirm} onChange={handleInputChange} placeholder='Enter "delete" to confirm' />
          <DialogFooter className='pt-2'>
            <Button onClick={handleCancel} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={deleteConfirm !== 'delete'}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
