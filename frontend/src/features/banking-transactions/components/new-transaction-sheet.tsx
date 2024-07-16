'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as z from 'zod';
import TransactionForm from './transaction-form';
import { useNewTransaction } from '@/hooks/use-new-transaction';
import { createNewBankTransaction } from '@/actions';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { createNewCategory } from '@/actions/create-category';
import { fetchCategories } from '@/actions/fetch-categories';
import { fetchPayees } from '@/actions/fetch-payees';
import { createNewPayee } from '@/actions/create-payee';

const NewBankingTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [payees, setPayees] = useState<{ label: string; value: string }[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const { toast } = useToast();
  const { accountId, isBankingOpen, onClose } = useNewTransaction();

  useEffect(() => {
    fetchAllPayees();
    fetchAllCategories();
  }, []);

  async function fetchAllPayees() {
    const result = await fetchPayees();

    const payeeOptions = result.map((str) => {
      return {
        label: str.name,
        value: str.name,
      };
    });

    setPayees(payeeOptions);
  }

  async function fetchAllCategories() {
    const result = await fetchCategories();

    const categoryOptions = result.map((str) => {
      return {
        label: str.name,
        value: str.name,
      };
    });

    setCategories(categoryOptions);
  }

  const onSubmit = async (values: z.infer<typeof bankingSchema>) => {
    setIsPending(true);

    const data = {
      ...values,
      amount: parseFloat(values.amount),
      transactionDate: values.transactionDate.toDateString(),
    };

    await createNewBankTransaction(data);

    onClose();
    setIsPending(false);
    toast({ title: 'Success!', description: 'Transaction was successfully created' });
  };

  const onCreatePayee = async (name: string) => {
    setIsPending(true);

    await createNewPayee({ name, accountId });

    await fetchAllPayees();

    setIsPending(false);
  };

  const onCreateCategory = async (name: string) => {
    setIsPending(true);

    await createNewCategory({ name, accountId });

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
      </SheetContent>
    </Sheet>
  );
};

export default NewBankingTransactionSheet;
