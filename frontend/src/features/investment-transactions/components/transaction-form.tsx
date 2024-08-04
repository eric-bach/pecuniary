'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InvestmentTransaction, Symbol } from '@/../../backend/src/appsync/api/codegen/appsync';
import { investmentSchema } from '@/types/transaction';
import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AmountInput } from '@/components/amount-input';
import { CurrencyAmountInput } from '@/components/currency-amount-input';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useState } from 'react';
import { fetchSymbols } from '@/actions/fetch-symbols';
import { createNewSymbol } from '@/actions';
import Combobox from '@/components/combobox';

type Props = {
  transaction?: InvestmentTransaction;
  defaultValues?: z.infer<typeof investmentSchema>;
  onSubmit: (values: z.infer<typeof investmentSchema>) => void;
  disabled?: boolean;
  transactionTypeOptions: { label: string; value: string }[];
};

const TransactionForm = ({ transaction, defaultValues, onSubmit, disabled, transactionTypeOptions }: Props) => {
  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues,
  });

  const [symbols, setSymbols] = useState<Symbol[]>([]);

  useEffect(() => {
    fetchAllSymbols();
  }, []);

  async function fetchAllSymbols() {
    setSymbols(await fetchSymbols());
  }

  async function createSymbol(name: string) {
    const result = await createNewSymbol(name);

    await fetchAllSymbols();
  }

  const handleSymbolChange = useCallback(
    (value: string) => {
      form.setValue('symbol', value);
    },
    [form]
  );

  const handleSubmit = (data: z.infer<typeof investmentSchema>) => {
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
          name='symbol'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Symbol</FormLabel>
              <FormControl>
                <Combobox type='symbol' items={symbols} onCreate={createSymbol} onChange={handleSymbolChange} />
                {/* <CreatableSelect
                  options={symbolOptions}
                  onCreate={onCreateSymbol}
                  value={field.value}
                  onChange={field.onChange}
                  //className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Symbol'
                /> */}
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
                  <SelectTrigger className='text-zinc-500 border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Transaction type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup className='-left-2'>
                    {/* <SelectLabel>Transaction type</SelectLabel> */}
                    {transactionTypeOptions.map((type) => (
                      <SelectItem key={type.label} value={type.value}>
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
