'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingInvestmentTransaction, fetchTransactionTypeOptions } from '@/actions';
import { useOpenInvestmentTransaction } from '@/hooks/use-open-investment-transaction';
import { investmentSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { InvestmentTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';
import { EditInvestmentTransactionFormState } from '@/actions/edit-investment-transaction';

const EditInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState<{ label: string; value: string }[]>([]);
  const { isOpen, onClose, transaction } = useOpenInvestmentTransaction();
  const [result, setResult] = useState<EditInvestmentTransactionFormState>();

  const trans = transaction as InvestmentTransaction;

  useEffect(() => {
    fetchAllTransactionTypes();
  }, []);

  async function fetchAllTransactionTypes() {
    setTransactionTypes(await fetchTransactionTypeOptions());
  }

  const onSubmit = async (values: z.infer<typeof investmentSchema>) => {
    setIsPending(true);

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

    const response = await editExistingInvestmentTransaction(data);

    if (response?.errors) {
      setResult(response);

      toast.error('Error!', { description: Object.values(response.errors).join('\n') });

      return;
    }

    onClose();
    setIsPending(false);

    toast.success('Success!', { description: 'Transaction was successfully updated' });
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
    </>
  );
};

export default EditInvestmentTransactionSheet;
