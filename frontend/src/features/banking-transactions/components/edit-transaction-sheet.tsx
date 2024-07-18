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
import { createNewCategory, fetchCategoryOptions, fetchPayeeOptions, createNewPayee } from '@/actions/index';

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
    setPayees(await fetchPayeeOptions());
  }

  async function fetchAllCategories() {
    setCategories(await fetchCategoryOptions());
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
