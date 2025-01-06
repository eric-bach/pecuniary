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
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  const queryClient = useQueryClient();

  const payeesQuery = useQuery({
    queryKey: ['payees'],
    queryFn: async () => fetch('/api/payees').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => fetch('/api/categories').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  const payeeMutation = useMutation({
    mutationFn: createNewPayee,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payees'] });
    },
    onError: (error) => {
      // TODO Handle error
    },
  });

  const categoryMutation = useMutation({
    mutationFn: createNewCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      // TODO Handle error
    },
  });

  async function createPayee(name: string) {
    payeeMutation.mutate(name);
  }

  async function createCategory(name: string) {
    categoryMutation.mutate(name);
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

  if (payeesQuery.isPending || categoriesQuery.isPending) return <></>;

  const payees: Payee[] = payeesQuery.data;
  const categories: Category[] = categoriesQuery.data;

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
                <Combobox
                  type='payee'
                  items={payees}
                  defaultValue={defaultValues?.payee}
                  onCreate={createPayee}
                  onChange={handlePayeeChange}
                />
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
                <Combobox
                  type='category'
                  defaultValue={defaultValues?.category}
                  items={categories}
                  onCreate={createCategory}
                  onChange={handleCategoryChange}
                />
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
