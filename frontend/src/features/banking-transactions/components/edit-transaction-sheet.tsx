'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingBankTransaction } from '@/actions';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { BankTransaction } from '../../../../../infrastructure/graphql/api/codegen/appsync';

const EditBankTransactionSheet = () => {
  const { toast } = useToast();
  const { isOpen, onClose, transaction } = useOpenBankTransaction();
  const [isPending, setIsPending] = useState(false);

  const trans = transaction as BankTransaction;

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    // TODO Fix this type error
    const data = {
      ...values,
      pk: `trans#${values.accountId}`,
      amount: parseFloat(values.amount),
      transactionId: values.transactionId!,

      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt!,
    };

    console.log('data', data);

    const result = await editExistingBankTransaction(data);

    console.log('result', result);

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully updated' });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit account</SheetDescription>
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
    </>
  );
};

export default EditBankTransactionSheet;
