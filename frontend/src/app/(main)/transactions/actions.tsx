'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { BankTransaction, InvestmentTransaction } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { deleteExistingTransaction } from '@/actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

type TransactionsProps = {
  transaction: BankTransaction | InvestmentTransaction;
};

export const Actions = ({ transaction }: TransactionsProps) => {
  const { toast } = useToast();
  const { onOpen: onBankingOpen } = useOpenBankTransaction();
  const { onOpen: onInvestmentOpen } = useOpenInvestmentTransaction();

  const [isOpen, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await deleteExistingTransaction(transaction);

    handleClose();

    toast({ title: 'Success!', description: 'Transaction was successfully deleted' });
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleDelete = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    if (transaction.entity === 'bank-transaction') {
      onBankingOpen(transaction as BankTransaction);
    } else if (transaction.entity === 'investment-transaction') {
      onInvestmentOpen(transaction as InvestmentTransaction);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
            <DialogDescription>To confirm deletion, enter &quot;delete&quot; below</DialogDescription>
          </DialogHeader>
          <DialogFooter className='pt-2'>
            <Button onClick={handleCancel} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
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
