import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavbarTitle, NavbarActions } from '@/components/layout/navbar-portal';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { EditTransactionSheet } from '@/components/accounts/edit-transaction-sheet';
import { AddTransactionSheet } from '@/components/accounts/add-transaction-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Route = createFileRoute('/_auth/transactions/')({
  component: TransactionsPage,
});

// Category icon/color mapping
const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  Shopping: { icon: '🛍️', color: 'text-pink-600' },
  Transfer: { icon: '💸', color: 'text-green-600' },
  'Entertainment & Recreation': { icon: '🎬', color: 'text-purple-600' },
  'Travel & Vacation': { icon: '✈️', color: 'text-blue-600' },
  Groceries: { icon: '🥬', color: 'text-green-600' },
  Clothing: { icon: '👕', color: 'text-indigo-600' },
  'Auto Payment': { icon: '🚗', color: 'text-red-600' },
  Phone: { icon: '📱', color: 'text-gray-600' },
  Mortgage: { icon: '🏠', color: 'text-orange-600' },
  Utilities: { icon: '💡', color: 'text-yellow-600' },
  Dining: { icon: '🍽️', color: 'text-orange-500' },
  Gas: { icon: '⛽', color: 'text-red-500' },
  Healthcare: { icon: '🏥', color: 'text-red-400' },
  Insurance: { icon: '🛡️', color: 'text-blue-500' },
  Subscriptions: { icon: '📦', color: 'text-purple-500' },
  Income: { icon: '💰', color: 'text-emerald-600' },
  Salary: { icon: '💵', color: 'text-emerald-600' },
};

// Account type color mapping
const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  Cash: 'bg-green-500',
  Investment: 'bg-blue-500',
  'Real Estate': 'bg-orange-500',
  'Credit Cards': 'bg-purple-500',
  Loans: 'bg-red-500',
};

function getCategoryDisplay(category?: string) {
  const cat = category || 'Uncategorized';
  const config = CATEGORY_CONFIG[cat] || { icon: '📋', color: 'text-gray-500' };
  return { ...config, name: cat };
}

function getPayeeInitial(payee: string): string {
  return payee.charAt(0).toUpperCase();
}

function getPayeeColor(payee: string): string {
  // Generate a consistent color based on payee name
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-indigo-500',
  ];
  const hash = payee.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAmount(amount: number, type: 'debit' | 'credit'): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === 'credit' ? `+$${formatted}` : `$${formatted}`;
}

function TransactionsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const transactions = useQuery(api.transactions.listAllByUser, user?.username ? { userId: user.username } : 'skip');
  const accounts = useQuery(api.accounts.list, user?.username ? { userId: user.username } : 'skip');

  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    _id: Id<'transactions'>;
    accountId: Id<'accounts'>;
    accountName: string;
    date: string;
    payee: string;
    description?: string;
    category?: string;
    type: 'debit' | 'credit';
    amount: number;
  } | null>(null);

  // Filter transactions by account
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (selectedAccount === 'all') return transactions;
    return transactions.filter((tx) => tx.accountId === selectedAccount);
  }, [transactions, selectedAccount]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<
      string,
      {
        date: string;
        transactions: typeof filteredTransactions;
        dailyTotal: number;
      }
    > = {};

    for (const tx of filteredTransactions) {
      if (!groups[tx.date]) {
        groups[tx.date] = { date: tx.date, transactions: [], dailyTotal: 0 };
      }
      groups[tx.date].transactions.push(tx);
      // Sum credits as positive, debits as positive (showing outflow)
      groups[tx.date].dailyTotal += tx.type === 'credit' ? tx.amount : tx.amount;
    }

    // Sort dates descending
    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredTransactions]);

  return (
    <div className='flex-1'>
      <NavbarTitle>Transactions</NavbarTitle>
      <NavbarActions>
        <Button variant='outline' size='sm' className='h-8 text-sm px-3 text-gray-600'>
          <Search className='h-3.5 w-3.5 mr-1.5' />
          Search
        </Button>
        <Button
          size='sm'
          className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'
          onClick={() => setIsAddTransactionOpen(true)}
        >
          <Plus className='h-3.5 w-3.5 mr-1.5' />
          Add transaction
        </Button>
      </NavbarActions>

      {/* Filter bar */}
      <div className='mb-6'>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className='w-[200px] h-9'>
            <SelectValue placeholder='All transactions' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All transactions</SelectItem>
            {accounts?.map((account) => (
              <SelectItem key={account._id} value={account._id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions list */}
      <div className='bg-white rounded-lg border border-gray-100'>
        {transactions === undefined ? (
          <div className='text-center text-gray-400 py-12 text-sm'>Loading...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className='text-center text-gray-400 py-12 text-sm'>No transactions yet</div>
        ) : (
          groupedTransactions.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className='flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100'>
                <span className='text-sm font-medium text-gray-500'>{formatDate(group.date)}</span>
                <span className='text-sm font-medium text-gray-500'>
                  $
                  {group.dailyTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Transactions for this date */}
              {group.transactions.map((tx) => {
                const categoryDisplay = getCategoryDisplay(tx.category);
                const accountColor = ACCOUNT_TYPE_COLORS[tx.accountType] || 'bg-gray-500';

                return (
                  <div
                    key={tx._id}
                    className='flex items-center px-4 py-2 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer group'
                    onClick={() =>
                      setEditingTransaction({
                        _id: tx._id as Id<'transactions'>,
                        accountId: tx.accountId as Id<'accounts'>,
                        accountName: tx.accountName,
                        date: tx.date,
                        payee: tx.payee,
                        description: tx.description,
                        category: tx.category,
                        type: tx.type,
                        amount: tx.amount,
                      })
                    }
                  >
                    {/* Payee icon */}
                    <div className='w-8 shrink-0'>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-[10px] ${getPayeeColor(tx.payee)}`}
                      >
                        {getPayeeInitial(tx.payee)}
                      </div>
                    </div>

                    {/* Payee name */}
                    <div className='w-44 shrink-0 pr-4'>
                      <div className='font-medium text-gray-900 truncate'>{tx.payee}</div>
                    </div>

                    {/* Category */}
                    <div className='flex items-center gap-1.5 w-52 shrink-0 pr-4'>
                      <span className='text-sm'>{categoryDisplay.icon}</span>
                      <span className={`text-sm truncate ${categoryDisplay.color}`}>{categoryDisplay.name}</span>
                    </div>

                    {/* Account */}
                    <div className='flex items-center gap-2 w-40 shrink-0 pr-4'>
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${accountColor}`} />
                      <span className='text-sm text-gray-600 truncate'>{tx.accountName}</span>
                    </div>

                    {/* Amount */}
                    <div className='flex items-center justify-end gap-2 ml-auto w-28 shrink-0'>
                      <span className={`text-sm font-semibold text-right ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {formatAmount(tx.amount, tx.type)}
                      </span>
                      <ChevronRight className='h-4 w-4 text-gray-300 group-hover:text-gray-400' />
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Transaction count */}
      {filteredTransactions.length > 0 && (
        <div className='px-4 py-2.5 text-xs text-gray-400'>
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Edit Transaction Sheet */}
      <EditTransactionSheet
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction}
        userId={user?.username ?? ''}
        accountName={editingTransaction?.accountName}
      />

      {/* Add Transaction Sheet */}
      <AddTransactionSheet
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accounts={accounts?.map((a) => ({ _id: a._id, name: a.name, type: a.type }))}
        userId={user?.username ?? ''}
      />
    </div>
  );
}
