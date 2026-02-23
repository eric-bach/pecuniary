// Category icon/color mapping
export const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  Shopping: { icon: '🛍️', color: 'text-pink-600' },
  Transfer: { icon: '💸', color: 'text-green-600' },
  Entertainment: { icon: '🎬', color: 'text-purple-600' },
  Travel: { icon: '✈️', color: 'text-blue-600' },
  Groceries: { icon: '🥬', color: 'text-green-600' },
  Clothing: { icon: '👕', color: 'text-indigo-600' },
  Auto: { icon: '🚗', color: 'text-red-600' },
  Phone: { icon: '📱', color: 'text-gray-600' },
  Mortgage: { icon: '🏠', color: 'text-orange-600' },
  Utilities: { icon: '💡', color: 'text-yellow-600' },
  Dining: { icon: '🍽️', color: 'text-orange-500' },
  Gas: { icon: '⛽', color: 'text-red-500' },
  Health: { icon: '🏥', color: 'text-red-400' },
  Insurance: { icon: '🛡️', color: 'text-blue-500' },
  Subscriptions: { icon: '📦', color: 'text-purple-500' },
  Income: { icon: '💰', color: 'text-emerald-600' },
  Salary: { icon: '💵', color: 'text-emerald-600' },
};

export function getCategoryDisplay(category?: string) {
  const cat = category || 'Uncategorized';
  const config = CATEGORY_CONFIG[cat] || { icon: '📋', color: 'text-gray-500' };
  return { ...config, name: cat };
}

export function getPayeeInitial(payee: string): string {
  return payee.charAt(0).toUpperCase();
}

const PAYEE_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-teal-500',
  'bg-indigo-500',
];

export function getPayeeColor(payee: string): string {
  const hash = payee.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PAYEE_COLORS[hash % PAYEE_COLORS.length];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatAmount(amount: number, type: 'debit' | 'credit'): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === 'credit' ? `+$${formatted}` : `$${formatted}`;
}

export interface Transaction {
  _id: string;
  accountId: string;
  date: string;
  payee: string;
  description?: string;
  category?: string;
  type: 'debit' | 'credit';
  amount: number;
  _creationTime: number;
}

export interface GroupedTransactions<T extends Transaction> {
  date: string;
  transactions: T[];
  dailyTotal: number;
}

export function groupTransactionsByDate<T extends Transaction>(transactions: T[]): GroupedTransactions<T>[] {
  const groups: Record<string, GroupedTransactions<T>> = {};

  for (const tx of transactions) {
    if (!groups[tx.date]) {
      groups[tx.date] = { date: tx.date, transactions: [], dailyTotal: 0 };
    }
    groups[tx.date].transactions.push(tx);
    groups[tx.date].dailyTotal += tx.amount;
  }

  // Sort dates descending
  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
}
