'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BankTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import { bankingSchema } from '@/types/transaction';
import { DatePicker } from '@/components/date-picker';
import { Select as CreatableSelect } from '@/components/select';
import { CurrencyAmountInput } from '@/components/currency-amount-input';
import { Input } from '@/components/ui/input';

type Props = {
  transaction?: BankTransaction;
  defaultValues?: z.infer<typeof bankingSchema>;
  onSubmit: (values: z.infer<typeof bankingSchema>) => void;
  disabled?: boolean;
  payeeOptions: { label: string; value: string }[];
  onCreatePayee: (name: string) => void;
  categoryOptions: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
};

const TransactionForm = ({
  transaction,
  defaultValues,
  onSubmit,
  disabled,
  payeeOptions,
  onCreatePayee,
  categoryOptions,
  onCreateCategory,
}: Props) => {
  const form = useForm<z.infer<typeof bankingSchema>>({
    resolver: zodResolver(bankingSchema),
    defaultValues,
  });

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
                <CreatableSelect
                  options={payeeOptions}
                  onCreate={onCreatePayee}
                  value={field.value}
                  onChange={field.onChange}
                  //className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Payee'
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
                <CreatableSelect
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  //className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Category'
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
