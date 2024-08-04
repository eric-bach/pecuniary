'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingBankTransaction } from '@/actions';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { BankTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';
import { EditBankTransactionFormState } from '@/actions/edit-bank-transaction';

const EditBankTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const { isOpen, onClose, transaction } = useOpenBankTransaction();
  const [result, setResult] = useState<EditBankTransactionFormState>();

  const trans = transaction as BankTransaction;

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    const data = {
      ...values,
      accountId: values.accountId,
      amount: parseFloat(values.amount),
      transactionId: values.transactionId!,
      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt,
    };

    const response = await editExistingBankTransaction(data);

    if (response?.errors) {
      setResult(response);
      return;
    }

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully updated' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='min-w-[600px] sm:w-[480px]'>
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Edit transaction</SheetDescription>
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

export default EditBankTransactionSheet;
