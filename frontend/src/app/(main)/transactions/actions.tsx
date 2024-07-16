'use client';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { BankTransaction, InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { deleteExistingTransaction } from '@/actions';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import DeleteItem from '@/components/delete-item';

type TransactionsProps = {
  transaction: BankTransaction | InvestmentTransaction;
};

export const Actions = ({ transaction }: TransactionsProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const { toast } = useToast();
  const { onOpen: onBankingOpen } = useOpenBankTransaction();
  const { onOpen: onInvestmentOpen } = useOpenInvestmentTransaction();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await deleteExistingTransaction(transaction);

    handleClose();

    // TODO Handle if delete fails
    toast({ title: 'Success!', description: 'Transaction was successfully deleted' });
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
      <DeleteItem
        isOpen={isOpen}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        dialogTitle={`Are you sure you want to delete this transaction?`}
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
