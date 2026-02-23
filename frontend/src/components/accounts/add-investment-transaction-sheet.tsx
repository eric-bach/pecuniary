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

interface Account {
  _id: Id<'accounts'>;
  name: string;
  type: string;
  currency?: 'USD' | 'CAD';
}

interface AddInvestmentTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId?: string;
  accountCurrency?: 'USD' | 'CAD';
  accounts?: Account[];
  userId: string;
}

export function AddInvestmentTransactionSheet({
  open,
  onOpenChange,
  accountId,
  accountCurrency,
  accounts,
  userId,
}: AddInvestmentTransactionSheetProps) {
  const createTransaction = useMutation(api.investmentTransactions.create);
  const symbolSuggestions = useQuery(api.investmentTransactions.getSymbolSuggestions, userId ? { userId } : 'skip') ?? [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [symbolOpen, setSymbolOpen] = useState(false);
  const [symbolInput, setSymbolInput] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accountId ?? '');
  const symbolInputRef = useRef<HTMLInputElement>(null);

  // Determine currency symbol based on account
  const getCurrencySymbol = () => {
    if (accountCurrency) return accountCurrency === 'CAD' ? 'C$' : '$';
    const selectedAccount = accounts?.find((a) => a._id === selectedAccountId);
    return selectedAccount?.currency === 'CAD' ? 'C$' : '$';
  };
  const currencySymbol = getCurrencySymbol();

  const today = new Date().toISOString().split('T')[0];

  const form = useForm<InvestmentTransactionFormValues>({
    resolver: zodResolver(investmentTransactionFormSchema),
    defaultValues: {
      date: today,
      type: 'buy',
      symbol: '',
      shares: '',
      unitPrice: '',
      commission: '',
      notes: '',
    },
  });

  // Auto-focus symbol when sheet opens
  useEffect(() => {
    if (open) {
      setTimeout(() => symbolInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form & symbol state when sheet closes
  useEffect(() => {
    if (!open) {
      form.reset({ date: today, type: 'buy', symbol: '', shares: '', unitPrice: '', commission: '', notes: '' });
      setSymbolInput('');
      setSymbolOpen(false);
      setSelectedAccountId(accountId ?? '');
    }
  }, [open, accountId]);

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
    const targetAccountId = accountId ?? selectedAccountId;
    if (!targetAccountId) {
      return;
    }
    setIsSubmitting(true);

    try {
      await createTransaction({
        accountId: targetAccountId as Id<'accounts'>,
        date: data.date,
        type: data.type as TransactionType,
        symbol: data.symbol.toUpperCase(),
        shares: parseFloat(data.shares),
        unitPrice: parseFloat(data.unitPrice),
        commission: data.commission ? parseFloat(data.commission) : undefined,
        notes: data.notes || undefined,
      });
      form.reset({ date: today, type: 'buy', symbol: '', shares: '', unitPrice: '', commission: '', notes: '' });
      setSymbolInput('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create investment transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper for numeric input handling
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

  // Filter accounts to show only Investment accounts
  const investmentAccounts = accounts?.filter((a) => a.type === 'Investment') ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-150 sm:max-w-120'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Add Investment Transaction</SheetTitle>
          <SheetDescription>Enter the details for the new investment transaction. Click save when you're done.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pl-4 pr-4'>
            {/* Account selector (only shown when accountId is not provided) */}
            {!accountId && investmentAccounts.length > 0 && (
              <div className='space-y-2'>
                <FormLabel>Account</FormLabel>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an account' />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentAccounts.map((account) => (
                      <SelectItem key={account._id} value={account._id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Symbol — inline Command so keyboard nav (↑↓ Enter Esc) works natively */}
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
                        onKeyDown={(e) => handleNumericKeyDown(e, false, 4)}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={(e) => {
                          const raw = e.target.value.replace(/,/g, '');
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            field.onChange(num.toFixed(4));
                          }
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

            <div className='flex justify-start pt-4 space-x-2'>
              <Button
                type='submit'
                disabled={isSubmitting || (!accountId && !selectedAccountId)}
                className='bg-[#0067c0] hover:bg-[#0067c0]/80'
              >
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
