'use client';

import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenTransaction } from '@/hooks/use-open-transaction';
import { Transaction } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { deleteExistingTransaction } from '@/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type TransactionsProps = {
  transaction: Transaction;
};

export const Actions = ({ transaction }: TransactionsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { onBankingOpen, onInvestmentOpen } = useOpenTransaction();

  const [isOpen, setOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');

  const handleClose = () => {
    setOpen(false);
    setDeleteConfirm('');
  };

  const handleConfirm = async () => {
    await deleteExistingTransaction(transaction);

    handleClose();

    toast({ title: 'Success!', description: 'Transaction was successfully deleted' });
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

  const handleOpen = () => {
    if (transaction.type.toLowerCase() === 'banking') onBankingOpen(transaction);
    else if (transaction.type.toLowerCase() === 'investment') onInvestmentOpen(transaction);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
            <DialogDescription>To confirm deletion, enter &quot;delete&quot; below</DialogDescription>
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
          <DropdownMenuItem onClick={() => router.push(`/accounts/${transaction.accountId}`)}>
            <Eye className='mr-2 size-4' />
            View
          </DropdownMenuItem>
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
