'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewBankTransaction } from '@/actions';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { createNewCategory, fetchCategoryOptions, fetchPayeeOptions, createNewPayee } from '@/actions/index';
import { SelectOption } from '@/types/select-option';
import { CreateBankTransactionFormState } from '@/actions/create-bank-transaction';

const NewBankingTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [payees, setPayees] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const { toast } = useToast();
  const { accountId, isBankingOpen, onClose } = useNewTransaction();
  const [result, setResult] = useState<CreateBankTransactionFormState>();

  useEffect(() => {
    fetchAllPayees();
    fetchAllCategories();
  }, []);

  async function fetchAllPayees() {
    setPayees(await fetchPayeeOptions());
  }

  async function fetchAllCategories() {
    setCategories(await fetchCategoryOptions());
  }

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    const data = {
      ...values,
      amount: parseFloat(values.amount),
      transactionDate: values.transactionDate.toDateString(),
    };

    const response = await createNewBankTransaction(data);

    console.log(response);

    if (response?.errors) {
      setResult(response);
      return;
    }

    onClose();
    setIsPending(false);
    toast({ title: 'Success!', description: 'Transaction was successfully created' });
  };

  const onCreatePayee = async (name: string) => {
    setIsPending(true);

    await createNewPayee(name);
    await fetchAllPayees();

    setIsPending(false);
  };

  const onCreateCategory = async (name: string) => {
    setIsPending(true);

    await createNewCategory(name);
    await fetchAllCategories();

    setIsPending(false);
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
          payeeOptions={payees}
          onCreatePayee={onCreatePayee}
          categoryOptions={categories}
          onCreateCategory={onCreateCategory}
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

export default NewBankingTransactionSheet;
