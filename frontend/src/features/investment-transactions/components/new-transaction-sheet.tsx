'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewInvestmentTransaction, fetchTransactionTypeOptions, fetchSymbolOptions, createNewSymbol } from '@/actions';
import { investmentSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { CreateInvestmentTransactionFormState } from '@/actions/create-investment-transaction';

const NewInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [symbols, setSymbols] = useState<{ label: string; value: string }[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<{ label: string; value: string }[]>([]);
  const [result, setResult] = useState<CreateInvestmentTransactionFormState>();

  const { toast } = useToast();
  const { accountId, isInvestmentOpen, onClose } = useNewTransaction();

  useEffect(() => {
    fetchAllSymbols();
    fetchAllTransactionTypes();
  }, []);

  async function fetchAllSymbols() {
    setSymbols(await fetchSymbolOptions());
  }

  async function fetchAllTransactionTypes() {
    setTransactionTypes(await fetchTransactionTypeOptions());
  }

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);

    const response = await createNewInvestmentTransaction({
      ...values,
      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
    });

    if (response?.errors) {
      setResult(response);
      return;
    }

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully created' });
  };

  const onCreateSymbol = async (name: string) => {
    setIsPending(true);

    await createNewSymbol(name);
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

export default NewInvestmentTransactionSheet;
