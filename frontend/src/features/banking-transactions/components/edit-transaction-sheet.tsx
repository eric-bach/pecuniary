'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TransactionForm from './transaction-form';
import * as z from 'zod';
import { editExistingBankTransaction } from '@/actions';
import { useOpenBankTransaction } from '@/hooks/use-open-bank-transaction';
import { bankingSchema } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { BankTransaction } from '../../../../../backend/src/appsync/api/codegen/appsync';
import { fetchCategories } from '@/actions/fetch-categories';
import { createNewCategory } from '@/actions/create-category';
import { createNewPayee } from '@/actions/create-payee';
import { fetchPayees } from '@/actions/fetch-payees';

const EditBankTransactionSheet = () => {
  const [isPending, setIsPending] = useState(false);
  const [payees, setPayees] = useState<{ label: string; value: string }[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const { toast } = useToast();
  const { isOpen, onClose, transaction } = useOpenBankTransaction();

  const trans = transaction as BankTransaction;

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

    // TODO Fix this type error
    const data = {
      ...values,
      pk: `trans#${values.accountId}`,
      amount: parseFloat(values.amount),
      transactionId: values.transactionId!,
      transactionDate: values.transactionDate.toDateString(),
      createdAt: values.createdAt!,
    };

    await editExistingBankTransaction(data);

    onClose();
    setIsPending(false);

    toast({ title: 'Success!', description: 'Transaction was successfully updated' });
  };

  const onCreatePayee = async (name: string) => {
    setIsPending(true);

    const accountId = trans.accountId;
    await createNewPayee({ name, accountId });

    await fetchAllPayees();

    setIsPending(false);
  };

  const onCreateCategory = async (name: string) => {
    setIsPending(true);

    const accountId = trans.accountId;
    await createNewCategory({ name, accountId });

    await fetchAllCategories();

    setIsPending(false);
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
            payeeOptions={payees}
            onCreatePayee={onCreatePayee}
            categoryOptions={categories}
            onCreateCategory={onCreateCategory}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditBankTransactionSheet;
