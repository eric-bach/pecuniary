'use client';

import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export const schema = z.object({
  name: z.string().min(1, 'Account name is required'),
  category: z
    .string()
    .refine(
      (value: string) => value === 'Banking' || value === 'Credit Card' || value === 'Investment' || value === 'Asset',
      'Category is not a valid type'
    ),
  type: z
    .string()
    .refine(
      (value: string) => value === 'Non Registered' || value === 'TFSA' || value === 'RRSP' || value === 'LIRA' || value === 'Crypto',
      'Type is not a valid type'
    ),
  accountId: z.string().optional(),
  createdAt: z.string().optional(),
});

type Props = {
  id?: string;
  defaultValues?: z.infer<typeof schema>;
  onSubmit: (values: z.infer<typeof schema>) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    onSubmit(data);
  };

  const handleDelete = () => {
    onDelete?.();
  };

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
                  className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
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
                  <SelectTrigger className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Account category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value='Banking'>Banking</SelectItem>
                    <SelectItem value='Credit Card'>Credit Card</SelectItem>
                    <SelectItem value='Investment'>Investment</SelectItem>
                    <SelectItem value='Asset'>Asset</SelectItem>
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
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                    <SelectValue placeholder='Account type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    <SelectItem value='Non Registered'>Non Registered</SelectItem>
                    <SelectItem value='TFSA'>TFSA</SelectItem>
                    <SelectItem value='RRSP'>RRSP</SelectItem>
                    <SelectItem value='LIRA'>LIRA</SelectItem>
                    <SelectItem value='Crypto'>Crypto</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={disabled}>
          {id ? 'Save changes' : 'Create account'}
        </Button>
        {!!id && (
          <Button type='button' disabled={disabled} onClick={handleDelete} className='w-full' variant='outline'>
            <Trash size={4} className='size-4 mr-2' />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AccountForm;
