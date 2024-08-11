'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewInvestmentTransaction } from '@/actions';
import { investmentSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TRANSACTION_TYPE_OPTIONS } from '@/types/transaction-type-options';

const NewInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);

  const { accountId, isInvestmentOpen, onClose } = useNewTransaction();

  const transactionTypes = TRANSACTION_TYPE_OPTIONS;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewInvestmentTransaction,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Transaction created successfully', {
        id: 'create-investment-transaction',
        duration: 5000,
        description: 'Your transaction has been created',
      });

      await queryClient.invalidateQueries({ queryKey: ['investment-transactions'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to create transaction', {
        id: 'create-investment-transaction',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);

    toast.loading('Creating transaction...', {
      id: 'create-investment-transaction',
    });

    const data = {
      ...values,
      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
    };

    mutation.mutate(data);
  };

  return (
    <Sheet open={isInvestmentOpen} onOpenChange={() => onClose()}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Create Tranasction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>

        <TransactionForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{
            accountId: accountId,
            transactionDate: new Date(),
            type: '',
            symbol: '',
            shares: '',
            price: '',
            commission: '',
          }}
          transactionTypeOptions={transactionTypes}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewInvestmentTransactionSheet;
