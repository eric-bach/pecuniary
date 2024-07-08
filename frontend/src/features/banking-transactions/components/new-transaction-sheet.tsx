'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewBankTransaction } from '@/actions';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

const NewBankingTransactionSheet = () => {
  const { toast } = useToast();
  const { accountId, isBankingOpen, onClose } = useNewTransaction();
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    const result = await createNewBankTransaction({
      ...values,
      amount: parseFloat(values.amount),
      transactionDate: values.transactionDate.toDateString(),
    });

    onClose();

    console.log('Transaction created', result);

    setIsPending(false);
    toast({ title: 'Success!', description: 'Transaction was successfully created' });
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
      </SheetContent>
    </Sheet>
  );
};

export default NewBankingTransactionSheet;
