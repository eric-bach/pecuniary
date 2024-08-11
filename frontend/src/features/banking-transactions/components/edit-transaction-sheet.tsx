'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingBankTransaction } from '@/actions';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { bankingSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useState } from 'react';
import { BankTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditBankTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const { isOpen, onClose, transaction } = useOpenBankTransaction();

  const trans = transaction as BankTransaction;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExistingBankTransaction,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Transaction updated successfully', {
        id: 'update-bank-transaction',
        duration: 5000,
        description: 'The transaction has been updated',
      });

      await queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to update transaction', {
        id: 'update-bank-transaction',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    const data = {
      ...values,
      accountId: values.accountId,
      amount: parseFloat(values.amount),
      transactionId: values.transactionId!,
      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt,
    };

    toast.loading('Updating transaction...', {
      id: 'update-bank-transaction',
      description: '',
    });

    mutation.mutate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Edit transaction</SheetDescription>
        </SheetHeader>

        <TransactionForm
          transaction={transaction as BankTransaction}
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{
            accountId: trans?.accountId,
            transactionId: trans?.transactionId,
            transactionDate: trans ? new Date(trans.transactionDate) : new Date(),
            payee: trans?.payee,
            category: trans?.category!,
            amount: trans?.amount.toString(),
            createdAt: trans?.createdAt,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditBankTransactionSheet;
