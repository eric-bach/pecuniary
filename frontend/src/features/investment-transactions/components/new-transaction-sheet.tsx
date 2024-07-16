'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewInvestmentTransaction, fetchTransactionTypes, fetchSymbols, createNewSymbol } from '@/actions';
import { investmentSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

const NewInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [symbols, setSymbols] = useState<{ label: string; value: string }[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<{ label: string; value: string }[]>([]);

  const { toast } = useToast();
  const { accountId, isInvestmentOpen, onClose } = useNewTransaction();

  useEffect(() => {
    fetchAllSymbols();
    fetchAllTransactionTypes();
  }, []);

  async function fetchAllSymbols() {
    const result = await fetchSymbols();

    const symbolOptions = result.map((str) => {
      return {
        label: str.name,
        value: str.name,
      };
    });

    setSymbols(symbolOptions);
  }

  async function fetchAllTransactionTypes() {
    const result = await fetchTransactionTypes();

    const transactionTypeOptions = result.map((str) => {
      return {
        label: str.label,
        value: str.value,
      };
    });

    setTransactionTypes(transactionTypeOptions);
  }

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);
    const result = await createNewInvestmentTransaction({
      ...values,
      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
    });
    onClose();

    console.log('Transaction created', result);

    setIsPending(false);
    toast({ title: 'Success!', description: 'Transaction was successfully created' });
  };

  const onCreateSymbol = async (name: string) => {
    setIsPending(true);

    await createNewSymbol({ name, accountId });

    await fetchAllSymbols();

    setIsPending(false);
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
          symbolOptions={symbols}
          onCreateSymbol={onCreateSymbol}
          transactionTypeOptions={transactionTypes}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewInvestmentTransactionSheet;
