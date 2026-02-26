import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Check, Trash2 } from 'lucide-react';

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

interface Transaction {
  _id: Id<'cashTransactions'>;
  accountId: Id<'accounts'>;
  accountName?: string;
  date: string;
  payee: string;
  description?: string;
  category?: string;
  type: 'debit' | 'credit';
  amount: number;
}

interface EditCashTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  userId: string;
  accountName?: string;
  accountType?: string;
}

export function EditCashTransactionSheet({
  open,
  onOpenChange,
  transaction,
  userId,
  accountName,
  accountType,
}: EditCashTransactionSheetProps) {
  const updateTransaction = useMutation(api.cashTransactions.update);
  const deleteTransaction = useMutation(api.cashTransactions.remove);
  const payeeSuggestions = useQuery(api.cashTransactions.getPayeeSuggestions, userId ? { userId } : 'skip') ?? [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [payeeOpen, setPayeeOpen] = useState(false);
  const [payeeInput, setPayeeInput] = useState('');
  const payeeInputRef = useRef<HTMLInputElement>(null);

  const displayAccountName = accountName ?? transaction?.accountName ?? '';

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: '',
      payee: '',
      category: '',
      description: '',
      amount: '',
    },
  });

  // Watch form values for real-time header updates
  const watchedPayee = form.watch('payee');
  const watchedAmount = form.watch('amount');
  const watchedDate = form.watch('date');

  // Format amount for display in header
  const displayAmount = (() => {
    const raw = parseFloat((watchedAmount || '0').replace(/,/g, ''));
    if (isNaN(raw)) return '$0.00';
    const formatted = Math.abs(raw).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `$${formatted}`;
  })();

  // Format date in long form for display
  const displayDate = (() => {
    if (!watchedDate) return '';
    const date = new Date(watchedDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();

  // Populate form when transaction changes or sheet opens
  useEffect(() => {
    if (open && transaction) {
      // Format amount with sign based on account type:
      // For Cash accounts: credit (deposit) = positive display, debit (withdrawal) = negative display
      // For Credit Cards: debit (charge) = positive display, credit (payment) = negative display
      let signedAmount: number;
      if (accountType === 'Credit Cards') {
        signedAmount = transaction.type === 'credit' ? -transaction.amount : transaction.amount;
      } else {
        // Cash and other account types
        signedAmount = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
      }
      const formattedAmount =
        (signedAmount < 0 ? '-' : '') +
        Math.abs(signedAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      form.reset({
        date: transaction.date,
        payee: transaction.payee,
        category: transaction.category ?? '',
        description: transaction.description ?? '',
        amount: formattedAmount,
      });
      setPayeeInput(transaction.payee);
      setTimeout(() => payeeInputRef.current?.focus(), 100);
    }
  }, [open, transaction, accountType]);

  // Reset payee dropdown state when sheet closes
  useEffect(() => {
    if (!open) {
      setPayeeOpen(false);
      setShowDeleteConfirm(false);
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
    if (!transaction) return;

    setIsSubmitting(true);
    const raw = parseFloat(data.amount.replace(/,/g, ''));

    // Determine transaction type based on account type:
    // For Cash accounts: positive = credit (deposit), negative = debit (withdrawal)
    // For Credit Cards: positive = debit (charge), negative = credit (payment)
    let txType: 'debit' | 'credit';
    if (accountType === 'Credit Cards') {
      txType = raw < 0 ? 'credit' : 'debit';
    } else {
      // Cash and other account types
      txType = raw < 0 ? 'debit' : 'credit';
    }

    try {
      await updateTransaction({
        transactionId: transaction._id,
        date: data.date,
        payee: data.payee,
        category: data.category || undefined,
        description: data.description || undefined,
        type: txType,
        amount: Math.abs(raw),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!transaction) return;
    setIsDeleting(true);
    try {
      await deleteTransaction({ transactionId: transaction._id });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-[600px] sm:max-w-[480px]'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Update the transaction details. Click save when you're done.</SheetDescription>
        </SheetHeader>
        {/* Header with payee and amount */}
        <div className='flex items-start justify-between mb-6 px-4 pt-2'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>{watchedPayee || 'Payee'}</h2>
          </div>
          <div className='text-right'>
            <div className='text-xl font-semibold text-gray-900'>{displayAmount}</div>
            {displayAccountName && (
              <div className='flex items-center justify-end gap-1.5 mt-1'>
                <div className='w-2 h-2 rounded-full bg-purple-500' />
                <span className='text-sm text-gray-500'>{displayAccountName}</span>
              </div>
            )}
          </div>
        </div>

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
                  {displayDate && <p className='text-sm text-gray-500 mt-1'>{displayDate}</p>}
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
                          // Allow digits (but check decimal places limit)
                          if (/^\d$/.test(e.key)) {
                            const dotIndex = field.value.indexOf('.');
                            const cursorPos = (e.currentTarget as HTMLInputElement).selectionStart ?? 0;
                            // If there's a decimal and cursor is after it, check if we already have 2 decimal places
                            if (dotIndex !== -1 && cursorPos > dotIndex) {
                              const decimals = field.value.substring(dotIndex + 1);
                              if (decimals.length >= 2) {
                                e.preventDefault();
                                return;
                              }
                            }
                            return;
                          }
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

            <div className='flex justify-between pt-4'>
              <div className='flex space-x-2'>
                <Button type='submit' disabled={isSubmitting || isDeleting} className='bg-[#0067c0] hover:bg-[#0067c0]/80'>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting || isDeleting}>
                  Cancel
                </Button>
              </div>
              {!showDeleteConfirm && (
                <Button
                  type='button'
                  variant='destructive'
                  disabled={isSubmitting || isDeleting}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className='h-4 w-4 mr-1.5' />
                  Delete
                </Button>
              )}
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className='mt-6 p-4 border border-red-200 rounded-lg bg-red-50'>
                <div className='text-sm font-semibold text-red-800 mb-2'>Delete Transaction</div>
                <p className='text-sm text-red-700 mb-3'>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                <div className='flex space-x-2'>
                  <Button type='button' variant='destructive' disabled={isDeleting} onClick={handleDelete}>
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                  <Button type='button' variant='outline' disabled={isDeleting} onClick={() => setShowDeleteConfirm(false)}>
                    No, Cancel
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
