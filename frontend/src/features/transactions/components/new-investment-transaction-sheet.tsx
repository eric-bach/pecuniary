'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './investment-transaction-form';
import { useNewInvestmentTransaction } from '@/hooks/use-new-investment-transaction';
import { createNewTransaction } from '@/actions';
import { schema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const NewInvestmentTransactionSheet = () => {
  const { toast } = useToast();
  const { accountId, isOpen, onClose } = useNewInvestmentTransaction();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsPending(true);
    await createNewTransaction({
      ...values,
      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
    });
    onClose();

    setIsPending(false);
    toast({ title: 'Success!', description: 'Transaction was successfully created' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
            createdAt: '',
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewInvestmentTransactionSheet;
