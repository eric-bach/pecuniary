import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavbarTitle, NavbarActions } from '@/components/layout/navbar-portal';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { EditCashTransactionSheet } from '@/components/accounts/edit-cash-transaction-sheet';
import { AddCashTransactionSheet } from '@/components/accounts/add-cash-transaction-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionFilterPopover, TransactionFilters, DEFAULT_FILTERS } from '@/components/transactions/transaction-filter-popover';
import { getCategoryDisplay, getPayeeInitial, getPayeeColor, formatDate, formatAmount } from '@/lib/transaction-utils';

export const Route = createFileRoute('/_auth/transactions/')({
  component: TransactionsPage,
});

// Account type color mapping
const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  Cash: 'bg-green-500',
  Investment: 'bg-blue-500',
  'Real Estate': 'bg-orange-500',
  'Credit Cards': 'bg-purple-500',
  Loans: 'bg-red-500',
};

function TransactionsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const transactions = useQuery(api.cashTransactions.listAllByUser, user?.username ? { userId: user.username } : 'skip');
  const accounts = useQuery(api.accounts.list, user?.username ? { userId: user.username } : 'skip');

  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [editingTransaction, setEditingTransaction] = useState<{
    _id: Id<'cashTransactions'>;
    accountId: Id<'accounts'>;
    accountName: string;
    accountType: string;
    date: string;
    payee: string;
    description?: string;
    category?: string;
    type: 'debit' | 'credit';
    amount: number;
  } | null>(null);

  // Extract unique categories and payees for filter dropdowns
  const { categories, payees } = useMemo(() => {
    if (!transactions) return { categories: [], payees: [] };
    const catSet = new Set<string>();
    const payeeSet = new Set<string>();
    for (const tx of transactions) {
      if (tx.category) catSet.add(tx.category);
      if (tx.payee) payeeSet.add(tx.payee);
    }
    return {
      categories: Array.from(catSet).sort(),
      payees: Array.from(payeeSet).sort(),
    };
  }, [transactions]);

  // Filter transactions by account and filters
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((tx) => {
      // Account filter
      if (selectedAccount !== 'all' && tx.accountId !== selectedAccount) return false;

      // Payee filter (case-insensitive contains)
      if (filters.payee && !tx.payee.toLowerCase().includes(filters.payee.toLowerCase())) return false;

      // Category filter
      if (filters.category && tx.category !== filters.category) return false;

      // Type filter
      if (filters.type !== 'all' && tx.type !== filters.type) return false;

      // Date range filter
      if (filters.dateFrom && tx.date < filters.dateFrom) return false;
      if (filters.dateTo && tx.date > filters.dateTo) return false;

      return true;
    });
  }, [transactions, selectedAccount, filters]);

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
        <TransactionFilterPopover filters={filters} onFiltersChange={setFilters} categories={categories} payees={payees} />
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
                        _id: tx._id as Id<'cashTransactions'>,
                        accountId: tx.accountId as Id<'accounts'>,
                        accountName: tx.accountName,
                        accountType: tx.accountType,
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
                    <div className='w-10 shrink-0'>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-xs ${getPayeeColor(tx.payee)}`}
                      >
                        {getPayeeInitial(tx.payee)}
                      </div>
                    </div>

                    {/* Payee name */}
                    <div className='w-1/4 min-w-0 pr-4'>
                      <div className='font-medium text-gray-900 truncate'>{tx.payee}</div>
                    </div>

                    {/* Category */}
                    <div className='flex items-center gap-1.5 w-1/4 min-w-0 pr-4'>
                      <span className='text-sm'>{categoryDisplay.icon}</span>
                      <span className={`text-sm truncate ${categoryDisplay.color}`}>{categoryDisplay.name}</span>
                    </div>

                    {/* Account */}
                    <div className='flex items-center gap-2 w-1/4 min-w-0 pr-4'>
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${accountColor}`} />
                      <span className='text-sm text-gray-600 truncate'>{tx.accountName}</span>
                    </div>

                    {/* Amount */}
                    <div className='flex items-center justify-end gap-2 w-1/4 min-w-0'>
                      <span className={`text-sm font-semibold text-right ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
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
      <EditCashTransactionSheet
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction}
        userId={user?.username ?? ''}
        accountName={editingTransaction?.accountName}
        accountType={editingTransaction?.accountType}
      />

      {/* Add Transaction Sheet */}
      <AddCashTransactionSheet
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accounts={accounts?.map((a) => ({ _id: a._id, name: a.name, type: a.type }))}
        userId={user?.username ?? ''}
      />
    </div>
  );
}
