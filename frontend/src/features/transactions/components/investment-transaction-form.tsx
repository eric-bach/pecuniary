'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Transaction } from '@/../../infrastructure/graphql/api/codegen/appsync';
import { schema } from '@/types/transaction';
import { DatePicker } from '@/components/date-picker';
import { Select as CreatableSelect } from '@/components/select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AmountInput } from '@/components/amount-input';
import { CurrencyAmountInput } from '@/components/currency-amount-input';
import { Input } from '@/components/ui/input';

type Props = {
  transaction?: Transaction;
  defaultValues?: z.infer<typeof schema>;
  onSubmit: (values: z.infer<typeof schema>) => void;
  disabled?: boolean;
};

const symbols = [
  { label: 'AAPL', value: 'AAPL' },
  { label: 'GOOGL', value: 'GOOGL' },
  { label: 'AMZN', value: 'AMZN' },
];
const transactionTypes = [
  { label: 'Buy', value: 'Buy' },
  { label: 'Sell', value: 'Sell' },
  { label: 'Dividend', value: 'Dividend' },
  { label: 'Interest', value: 'Interest' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Withdrawal', value: 'Withdrawal' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Fee', value: 'Fee' },
  { label: 'Other', value: 'Other' },
];

const TransactionForm = ({ transaction, defaultValues, onSubmit, disabled }: Props) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
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
          name='symbol'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Symbol</FormLabel>
              <FormControl>
                <CreatableSelect
                  options={symbols}
                  onCreate={() => console.log('Create symbol')}
                  value={field.value}
                  onChange={field.onChange}
                  //className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Symbol'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Transaction type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Transaction type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Transaction type</SelectLabel>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='shares'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shares</FormLabel>
              <FormControl>
                <AmountInput value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='price'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <CurrencyAmountInput value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='commission'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission</FormLabel>
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
