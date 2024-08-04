'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BankTransaction, Category, Payee } from '@/../../backend/src/appsync/api/codegen/appsync';
import { bankingSchema } from '@/types/transaction';
import { DatePicker } from '@/components/date-picker';
import { CurrencyAmountInput } from '@/components/currency-amount-input';
import { Input } from '@/components/ui/input';
import { createNewCategory, createNewPayee } from '@/actions';
import Combobox from '@/components/combobox';
import { useCallback, useEffect, useState } from 'react';
import { fetchPayees } from '@/actions/fetch-payees';
import { fetchCategories } from '@/actions/fetch-cateogies';

type Props = {
  transaction?: BankTransaction;
  defaultValues?: z.infer<typeof bankingSchema>;
  onSubmit: (values: z.infer<typeof bankingSchema>) => void;
  disabled?: boolean;
};

const TransactionForm = ({ transaction, defaultValues, onSubmit, disabled }: Props) => {
  const form = useForm<z.infer<typeof bankingSchema>>({
    resolver: zodResolver(bankingSchema),
    defaultValues,
  });

  const [payees, setPayees] = useState<Payee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchAllPayees();
    fetchAllCategories();
  }, []);

  async function fetchAllPayees() {
    setPayees(await fetchPayees());
  }

  async function fetchAllCategories() {
    setCategories(await fetchCategories());
  }

  async function createPayee(name: string) {
    const result = await createNewPayee(name);

    await fetchAllPayees();
  }

  async function createCategory(name: string) {
    const result = await createNewCategory(name);

    await fetchAllCategories();
  }

  const handlePayeeChange = useCallback(
    (value: string) => {
      form.setValue('payee', value);
    },
    [form]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue('category', value);
    },
    [form]
  );

  const handleSubmit = (data: z.infer<typeof bankingSchema>) => {
    console.log('Submitting', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
        <FormField
          control={form.control}
          name='accountId'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='hidden' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='transactionId'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='hidden' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='createdAt'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='hidden' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='transactionDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Transaction date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='payee'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Payee</FormLabel>
              <FormControl>
                <Combobox type='payee' items={payees} onCreate={createPayee} onChange={handlePayeeChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Category</FormLabel>
              <FormControl>
                <Combobox type='category' items={categories} onCreate={createCategory} onChange={handleCategoryChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='amount'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyAmountInput value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='w-full' disabled={disabled}>
          {transaction ? 'Save changes' : 'Create transaction'}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
