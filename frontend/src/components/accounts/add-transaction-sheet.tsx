import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Check } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const transactionFormSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  payee: z.string().min(1, 'Payee is required.').max(100, 'Payee must be less than 100 characters.'),
  category: z.string().max(100, 'Category must be less than 100 characters.').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters.').optional(),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) !== 0, {
      message: 'Amount must be a non-zero number.',
    }),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  userId: string;
}

export function AddTransactionSheet({ open, onOpenChange, accountId, userId }: AddTransactionSheetProps) {
  const createTransaction = useMutation(api.transactions.create);
  const payeeSuggestions = useQuery(api.transactions.getPayeeSuggestions, userId ? { userId } : 'skip') ?? [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payeeOpen, setPayeeOpen] = useState(false);
  const [payeeInput, setPayeeInput] = useState('');
  const payeeInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: today,
      payee: '',
      category: '',
      description: '',
      amount: '',
    },
  });

  // Auto-focus payee when sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => payeeInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form & payee state when sheet closes
  useEffect(() => {
    if (!open) {
      form.reset({ date: today, payee: '', category: '', description: '', amount: '' });
      setPayeeInput('');
      setPayeeOpen(false);
    }
  }, [open]);

  const filteredSuggestions =
    payeeInput.trim().length === 0
      ? payeeSuggestions
      : payeeSuggestions.filter((s) => s.payee.toLowerCase().includes(payeeInput.toLowerCase()));

  function selectPayee(payee: string, lastCategory?: string) {
    form.setValue('payee', payee, { shouldValidate: true });
    setPayeeInput(payee);
    if (lastCategory) {
      form.setValue('category', lastCategory, { shouldValidate: true });
    }
    setPayeeOpen(false);
  }

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);
    const raw = parseFloat(data.amount.replace(/,/g, ''));
    try {
      await createTransaction({
        accountId: accountId as Id<'accounts'>,
        date: data.date,
        payee: data.payee,
        category: data.category || undefined,
        description: data.description || undefined,
        type: raw < 0 ? 'credit' : 'debit',
        amount: Math.abs(raw),
      });
      form.reset({ date: today, payee: '', category: '', description: '', amount: '' });
      setPayeeInput('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-[600px] sm:max-w-[480px]'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>Enter the details for the new transaction. Click save when you're done.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pl-4 pr-4'>
            {/* Date */}
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payee — inline Command so keyboard nav (↑↓ Enter Esc) works natively */}
            <FormField
              control={form.control}
              name='payee'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee</FormLabel>
                  <FormControl>
                    <Command className='border rounded-md overflow-visible bg-white' shouldFilter={false}>
                      <CommandInput
                        ref={payeeInputRef}
                        placeholder='Amazon'
                        value={payeeInput}
                        onValueChange={(val) => {
                          setPayeeInput(val);
                          field.onChange(val);
                          setPayeeOpen(val.trim().length > 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setPayeeOpen(false);
                        }}
                        className='h-9 text-sm'
                      />
                      {payeeOpen && filteredSuggestions.length > 0 && (
                        <div className='relative'>
                          <CommandList className='absolute z-50 top-1 left-0 right-0 max-h-48 overflow-auto rounded-md border bg-white shadow-md'>
                            <CommandEmpty>No matches</CommandEmpty>
                            <CommandGroup>
                              {filteredSuggestions.map((s) => (
                                <CommandItem key={s.payee} value={s.payee} onSelect={() => selectPayee(s.payee, s.lastCategory)}>
                                  <Check className={cn('mr-2 h-4 w-4 shrink-0', field.value === s.payee ? 'opacity-100' : 'opacity-0')} />
                                  <div>
                                    <div className='text-sm'>{s.payee}</div>
                                    {s.lastCategory && <div className='text-xs text-gray-400'>{s.lastCategory}</div>}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </div>
                      )}
                    </Command>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className='text-gray-400 font-normal text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Groceries' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className='text-gray-400 font-normal text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Milk' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount — full width, negative = credit */}
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none'>$</span>
                      <Input
                        placeholder='0.00'
                        className='pl-7'
                        value={field.value}
                        onKeyDown={(e) => {
                          const allowed = [
                            'Backspace',
                            'Delete',
                            'ArrowLeft',
                            'ArrowRight',
                            'ArrowUp',
                            'ArrowDown',
                            'Tab',
                            'Enter',
                            'Home',
                            'End',
                          ];
                          if (allowed.includes(e.key)) return;
                          // Allow Ctrl/Cmd combinations (copy, paste, etc.)
                          if (e.ctrlKey || e.metaKey) return;
                          // Allow digits
                          if (/^\d$/.test(e.key)) return;
                          // Allow decimal point only if none exists yet
                          if (e.key === '.' && !field.value.includes('.')) return;
                          // Allow minus only at the very start
                          if (e.key === '-' && (e.currentTarget as HTMLInputElement).selectionStart === 0 && !field.value.includes('-'))
                            return;
                          e.preventDefault();
                        }}
                        onChange={(e) => {
                          // Strip any stray non-numeric chars except leading - and one .
                          const raw = e.target.value;
                          field.onChange(raw);
                        }}
                        onBlur={(e) => {
                          const raw = e.target.value.replace(/,/g, '');
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            const formatted =
                              (num < 0 ? '-' : '') +
                              Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            field.onChange(formatted);
                          }
                        }}
                        onFocus={(e) => {
                          // Strip commas so the user can edit the raw number
                          const raw = e.target.value.replace(/,/g, '');
                          field.onChange(raw);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-start pt-4 space-x-2'>
              <Button type='submit' disabled={isSubmitting} className='bg-[#0067c0] hover:bg-[#0067c0]/80'>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
