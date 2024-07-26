'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { createNewSymbol, editExistingInvestmentTransaction, fetchSymbolOptions, fetchTransactionTypeOptions } from '@/actions';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { investmentSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';

const EditInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [symbols, setSymbols] = useState<{ label: string; value: string }[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<{ label: string; value: string }[]>([]);
  const { toast } = useToast();
  const { isOpen, onClose, transaction } = useOpenInvestmentTransaction();

  const trans = transaction as InvestmentTransaction;

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

    // TODO Fix this type error
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

    const result = await editExistingInvestmentTransaction(data);

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully updated' });
  };

  const onCreateSymbol = async (name: string) => {
    setIsPending(true);

    await createNewSymbol(name);
    await fetchAllSymbols();

    setIsPending(false);
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
            symbolOptions={symbols}
            onCreateSymbol={onCreateSymbol}
            transactionTypeOptions={transactionTypes}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditInvestmentTransactionSheet;
