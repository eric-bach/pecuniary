'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewInvestmentTransaction } from '@/actions';
import { investmentSchema } from '@/types/transaction';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateInvestmentTransactionFormState } from '@/actions/create-investment-transaction';
import { useQuery } from '@tanstack/react-query';
import { SelectOption } from '@/types/select-option';

const NewInvestmentTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<CreateInvestmentTransactionFormState>();

  const { accountId, isInvestmentOpen, onClose } = useNewTransaction();

  const transactionTypeQuery = useQuery({
    queryKey: ['transaction-types'],
    queryFn: async () => fetch('/api/transaction-type-options').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

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

      toast.error('Error!', { description: Object.values(response.errors).join('\n') });

      return;
    }

    onClose();
    setIsPending(false);

    toast.success('Success!', { description: 'Transaction was successfully created' });
  };

  if (transactionTypeQuery.isPending) return <div>Loading...</div>;

  const transactionTypes: SelectOption[] = transactionTypeQuery.data;

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
