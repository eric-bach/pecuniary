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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const transactionTypes = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'dividend', label: 'Dividend' },
  { value: 'split', label: 'Split' },
  { value: 'transfer_in', label: 'Transfer In' },
  { value: 'transfer_out', label: 'Transfer Out' },
] as const;

type TransactionType = (typeof transactionTypes)[number]['value'];

const investmentTransactionFormSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  type: z.enum(['buy', 'sell', 'dividend', 'split', 'transfer_in', 'transfer_out'], {
    message: 'Transaction type is required.',
  }),
  symbol: z
    .string()
    .min(1, 'Symbol is required.')
    .max(10, 'Symbol must be less than 10 characters.')
    .transform((val) => val.toUpperCase()),
  shares: z
    .string()
    .min(1, 'Shares is required.')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Shares must be a positive number.',
    }),
  unitPrice: z
    .string()
    .min(1, 'Unit price is required.')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'Unit price must be a non-negative number.',
    }),
  commission: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'Commission must be a non-negative number.',
    }),
  notes: z.string().max(500, 'Notes must be less than 500 characters.').optional(),
});

type InvestmentTransactionFormValues = z.infer<typeof investmentTransactionFormSchema>;

interface Transaction {
  _id: Id<'investmentTransactions'>;
  accountId: Id<'accounts'>;
  accountName?: string;
  date: string;
  type: 'buy' | 'sell' | 'dividend' | 'split' | 'transfer_in' | 'transfer_out';
  symbol: string;
  shares: number;
  unitPrice: number;
  commission?: number;
  notes?: string;
}

interface EditInvestmentTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  userId: string;
  accountName?: string;
  accountCurrency?: 'USD' | 'CAD';
}

export function EditInvestmentTransactionSheet({
  open,
  onOpenChange,
  transaction,
  userId,
  accountName,
  accountCurrency,
}: EditInvestmentTransactionSheetProps) {
  const updateTransaction = useMutation(api.investmentTransactions.update);
  const deleteTransaction = useMutation(api.investmentTransactions.remove);
  const symbolSuggestions = useQuery(api.investmentTransactions.getSymbolSuggestions, userId ? { userId } : 'skip') ?? [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [symbolInput, setSymbolInput] = useState('');
  const symbolInputRef = useRef<HTMLInputElement>(null);

  const displayAccountName = accountName ?? transaction?.accountName ?? '';
  const currencySymbol = accountCurrency === 'CAD' ? 'C$' : '$';

  const form = useForm<InvestmentTransactionFormValues>({
    resolver: zodResolver(investmentTransactionFormSchema),
    defaultValues: {
      date: '',
      type: 'buy',
      symbol: '',
      shares: '',
      unitPrice: '',
      commission: '',
      notes: '',
    },
  });

  const watchedSymbol = form.watch('symbol');
  const watchedType = form.watch('type');
  const watchedShares = form.watch('shares');
  const watchedUnitPrice = form.watch('unitPrice');
  const watchedCommission = form.watch('commission');

  const displayDescription = (() => {
    if (!watchedSymbol) return 'Investment';
    const typeLabel = transactionTypes.find((t) => t.value === watchedType)?.label || watchedType;
    return `${typeLabel} ${watchedSymbol}`;
  })();

  const displayTotal = (() => {
    const shares = parseFloat(watchedShares || '0');
    const price = parseFloat(watchedUnitPrice || '0');
    const commission = parseFloat(watchedCommission || '0');
    if (isNaN(shares) || isNaN(price)) return `${currencySymbol}0.00`;
    const total = shares * price + (isNaN(commission) ? 0 : commission);
    return `${currencySymbol}${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  })();

  useEffect(() => {
    if (open && transaction) {
      form.reset({
        date: transaction.date,
        type: transaction.type,
        symbol: transaction.symbol,
        shares: transaction.shares.toString(),
        unitPrice: transaction.unitPrice.toString(),
        commission: transaction.commission ? transaction.commission.toString() : '',
        notes: transaction.notes || '',
      });
      setSymbolInput(transaction.symbol);
      setTimeout(() => symbolInputRef.current?.focus(), 100);
    }
  }, [open, transaction]);

  useEffect(() => {
    if (!open) {
      setSymbolOpen(false);
      setShowDeleteConfirm(false);
    }
  }, [open]);

  const filteredSuggestions =
    symbolInput.trim().length === 0
      ? symbolSuggestions
      : symbolSuggestions.filter((s) => s.symbol.toLowerCase().includes(symbolInput.toLowerCase()));

  function selectSymbol(symbol: string) {
    form.setValue('symbol', symbol, { shouldValidate: true });
    setSymbolInput(symbol);
    setSymbolOpen(false);
  }

  async function onSubmit(data: InvestmentTransactionFormValues) {
    if (!transaction) return;

    setIsSubmitting(true);

    try {
      await updateTransaction({
        transactionId: transaction._id,
        date: data.date,
        type: data.type as TransactionType,
        symbol: data.symbol.toUpperCase(),
        shares: parseFloat(data.shares),
        unitPrice: parseFloat(data.unitPrice),
        commission: data.commission ? parseFloat(data.commission) : undefined,
        notes: data.notes || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update investment transaction:', error);
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
      console.error('Failed to delete investment transaction:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, allowNegative = false, decimalPlaces = 6) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;

    const value = (e.currentTarget as HTMLInputElement).value;

    if (/^\d$/.test(e.key)) {
      const dotIndex = value.indexOf('.');
      const cursorPos = (e.currentTarget as HTMLInputElement).selectionStart ?? 0;
      if (dotIndex !== -1 && cursorPos > dotIndex) {
        const decimals = value.substring(dotIndex + 1);
        if (decimals.length >= decimalPlaces) {
          e.preventDefault();
          return;
        }
      }
      return;
    }

    if (e.key === '.' && !value.includes('.')) return;
    if (allowNegative && e.key === '-' && (e.currentTarget as HTMLInputElement).selectionStart === 0 && !value.includes('-')) return;

    e.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-150 sm:max-w-120'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Edit Investment Transaction</SheetTitle>
          <SheetDescription>Update the transaction details. Click save when you're done.</SheetDescription>
        </SheetHeader>

        {/* Header with symbol type and amount */}
        <div className='flex items-start justify-between mb-6 px-4 pt-2'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>{displayDescription}</h2>
          </div>
          <div className='text-right'>
            <div className='text-xl font-semibold text-gray-900'>{displayTotal}</div>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select transaction type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Symbol */}
            <FormField
              control={form.control}
              name='symbol'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Command className='border rounded-md overflow-visible bg-white' shouldFilter={false}>
                      <CommandInput
                        ref={symbolInputRef}
                        placeholder='AAPL'
                        value={symbolInput}
                        onValueChange={(val) => {
                          setSymbolInput(val.toUpperCase());
                          field.onChange(val.toUpperCase());
                          setSymbolOpen(val.trim().length > 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setSymbolOpen(false);
                        }}
                        className='h-9 text-sm uppercase'
                      />
                      {symbolOpen && filteredSuggestions.length > 0 && (
                        <div className='relative'>
                          <CommandList className='absolute z-50 top-1 left-0 right-0 max-h-48 overflow-auto rounded-md border bg-white shadow-md'>
                            <CommandEmpty>No matches</CommandEmpty>
                            <CommandGroup>
                              {filteredSuggestions.map((s) => (
                                <CommandItem key={s.symbol} value={s.symbol} onSelect={() => selectSymbol(s.symbol)}>
                                  <Check className={cn('mr-2 h-4 w-4 shrink-0', field.value === s.symbol ? 'opacity-100' : 'opacity-0')} />
                                  <span className='font-mono'>{s.symbol}</span>
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

            {/* Shares */}
            <FormField
              control={form.control}
              name='shares'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='100'
                      value={field.value}
                      onKeyDown={(e) => handleNumericKeyDown(e, false, 6)}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit Price */}
            <FormField
              control={form.control}
              name='unitPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none'>
                        {currencySymbol}
                      </span>
                      <Input
                        placeholder='0.00'
                        className='pl-7'
                        value={field.value}
                        onKeyDown={(e) => handleNumericKeyDown(e, false, 2)}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={(e) => {
                          const raw = e.target.value.replace(/,/g, '');
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            field.onChange(num.toFixed(2));
                          }
                        }}
                        onFocus={(e) => {
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

            {/* Commission */}
            <FormField
              control={form.control}
              name='commission'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Commission <span className='text-gray-400 font-normal text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none'>
                        {currencySymbol}
                      </span>
                      <Input
                        placeholder='0.00'
                        className='pl-7'
                        value={field.value}
                        onKeyDown={(e) => handleNumericKeyDown(e, false, 2)}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={(e) => {
                          const raw = e.target.value.replace(/,/g, '');
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            field.onChange(num.toFixed(2));
                          }
                        }}
                        onFocus={(e) => {
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

            {/* Notes */}
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes <span className='text-gray-400 font-normal text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Additional notes...' {...field} />
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
