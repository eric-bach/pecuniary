'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingInvestmentTransaction } from '@/actions';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { investmentSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';

const EditInvestmentTransactionSheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose, transaction } = useOpenInvestmentTransaction();
  const [isPending, setIsPending] = useState(false);

  const trans = transaction as InvestmentTransaction;

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);

    // TODO Fix this type error
    const data = {
      ...values,
      pk: `trans#${values.accountId}`,
      transactionId: values.transactionId!,

      shares: parseFloat(values.shares),
      price: parseFloat(values.price),
      commission: parseFloat(values.commission),
      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt!,
    };

    console.log('data', data);

    const result = await editExistingInvestmentTransaction(data);

    console.log('result', result);

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully updated' });
  };

  console.log(trans);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit account</SheetDescription>
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
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditInvestmentTransactionSheet;
