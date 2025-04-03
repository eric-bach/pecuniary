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
import { useCallback } from 'react';
import { createNewSymbol } from '@/actions';
import Combobox from '@/components/combobox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  const queryClient = useQueryClient();

  const symbolsQuery = useQuery({
    queryKey: ['symbols'],
    queryFn: async () => fetch('/api/symbols').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: createNewSymbol,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['symbols'] });
    },
    onError: () => {
      // TODO Handle error
    },
  });

  async function createSymbol(name: string) {
    mutation.mutate(name);
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

  if (symbolsQuery.isPending) return <></>;

  const symbols: Symbol[] = symbolsQuery.data;

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
          render={() => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Symbol</FormLabel>
              <FormControl>
                <Combobox
                  type='symbol'
                  defaultValue={defaultValues?.symbol}
                  items={symbols}
                  onCreate={createSymbol}
                  onChange={handleSymbolChange}
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
                  <SelectTrigger className='border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Transaction type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
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
