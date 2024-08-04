'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useEffect, useState } from 'react';
import { assetTypes, bankingTypes, categories, creditCardTypes, investmentTypes, schema } from '@/types/account';

type Props = {
  account?: Account;
  defaultValues?: z.infer<typeof schema>;
  onSubmit: (values: z.infer<typeof schema>) => void;
  disabled?: boolean;
};

const AccountForm = ({ account, defaultValues, onSubmit, disabled }: Props) => {
  const [selectOptions, setSelectOptions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Submitting', data);
    onSubmit(data);
  };

  const categoryWatch = form.watch('category');

  useEffect(() => {
    if (categoryWatch === 'Investment') {
      setSelectOptions(investmentTypes);
    } else if (categoryWatch === 'Banking') {
      setSelectOptions(bankingTypes);
    } else if (categoryWatch === 'Credit Card') {
      setSelectOptions(creditCardTypes);
      form.setValue('type', 'Credit');
    } else if (categoryWatch === 'Asset') {
      setSelectOptions(assetTypes);
      form.setValue('type', 'Property');
    }
  }, [categoryWatch, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Account Name</FormLabel>
              <FormControl>
                <Input
                  className='border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Account name'
                  {...field}
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
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Account Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    disabled={!!account}
                    className='border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  >
                    <SelectValue placeholder='Account category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
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
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Account Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!categoryWatch}>
                <FormControl>
                  <SelectTrigger
                    disabled={!!account}
                    className='border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  >
                    <SelectValue placeholder='Account type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {selectOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={disabled}>
          {account ? 'Save changes' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
