'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewBankTransaction } from '@/actions';
import { bankingSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateBankTransactionFormState } from '@/actions/create-bank-transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewBankingTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const { accountId, isBankingOpen, onClose } = useNewTransaction();
  const [result, setResult] = useState<CreateBankTransactionFormState>();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNewBankTransaction,
    onSuccess: async () => {
      setIsPending(false);
      onClose();

      toast.success('Transaction created successfully 🎉', {
        id: 'create-bank-transaction',
      });

      await queryClient.invalidateQueries({ queryKey: ['bank-transactions'] });
    },
    onError: (error) => {
      setIsPending(false);

      toast.error('Failed to create transaction', {
        id: 'create-bank-transaction',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    toast.loading('Creating transaction...', {
      id: 'create-bank-transaction',
    });

    const data = {
      ...values,
      amount: parseFloat(values.amount),
      transactionDate: values.transactionDate.toDateString(),
    };

    mutation.mutate(data);
  };

  return (
    <Sheet open={isBankingOpen} onOpenChange={() => onClose()}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Create Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>

        <TransactionForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValues={{
            accountId: accountId,
            transactionDate: new Date(),
            category: '',
            payee: '',
            amount: '',
          }}
        />

        {result?.errors && (
          <div className='text-red-500 text-sm'>
            {Object.values(result.errors).map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewBankingTransactionSheet;
