'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingInvestmentTransaction } from '@/actions';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { investmentSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useState } from 'react';
import { InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';
import { TRANSACTION_TYPE_OPTIONS } from '@/types/transaction-type-options';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const { isOpen, onClose, transaction } = useOpenInvestmentTransaction();

  const transactionTypes = TRANSACTION_TYPE_OPTIONS;

  const trans = transaction as InvestmentTransaction;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editExistingInvestmentTransaction,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Transaction updated successfully', {
        id: 'update-investment-transaction',
        duration: 5000,
        description: 'The transaction has been updated',
      });

      await queryClient.invalidateQueries({ queryKey: ['investment-transactions'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to update transaction', {
        id: 'update-investment-transaction',
        description: '',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);

    const data = {
      ...values,
      accountId: values.accountId,
      transactionId: values.transactionId!,
      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt,
    };

    toast.loading('Updating transaction...', {
      id: 'update-investment-transaction',
    });

    mutation.mutate(data);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit transaction</SheetDescription>
          </SheetHeader>

          <TransactionForm
            transaction={transaction as InvestmentTransaction}
            onSubmit={onSubmit}
            disabled={isPending}
            defaultValues={{
              accountId: trans?.accountId,
              transactionId: trans?.transactionId,
              transactionDate: trans ? new Date(trans.transactionDate) : new Date(),
              type: trans?.type,
              symbol: trans?.symbol,
              shares: trans?.shares.toString(),
              price: trans?.price.toString(),
              commission: trans?.commission.toString(),
              createdAt: trans?.createdAt,
            }}
            transactionTypeOptions={transactionTypes}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditInvestmentTransactionSheet;
