'use server';

import { SelectOption } from '@/types/select-option';

export async function fetchTransactionTypeOptions(): Promise<SelectOption[]> {
  return [
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
}
