import { useState, useMemo } from 'react';
import { NavbarActions, NavbarTitle } from '@/components/layout/navbar-portal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { Pencil, ChevronRight, Plus } from 'lucide-react';
import {
  getCategoryDisplay,
  getPayeeInitial,
  getPayeeColor,
  formatDate,
  formatAmount,
  groupTransactionsByDate,
} from '@/lib/transaction-utils';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { AddCashTransactionSheet } from '@/components/accounts/add-cash-transaction-sheet';
import { EditCashTransactionSheet } from '@/components/accounts/edit-cash-transaction-sheet';
import { EditAccountSheet } from '@/components/accounts/edit-account-sheet';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface Account {
  _id: Id<'accounts'>;
  name: string;
  description?: string;
  type: 'Cash' | 'Investment' | 'Real Estate' | 'Credit Cards' | 'Loans';
  userId: string;
}

interface CashAccountDetailProps {
  accountId: string;
  account: Account;
  userId: string;
}

export function CashAccountDetail({ accountId, account, userId }: CashAccountDetailProps) {
  const rawTransactions = useQuery(api.cashTransactions.listByAccount, { accountId: accountId as Id<'accounts'> });
  const transactions = rawTransactions
    ? [...rawTransactions].sort((a, b) => {
        const dateDiff = b.date.localeCompare(a.date);
        return dateDiff !== 0 ? dateDiff : b._creationTime - a._creationTime;
      })
    : undefined;
  const balance = useQuery(api.cashTransactions.getBalance, { accountId: accountId as Id<'accounts'> });
  const balanceHistory = useQuery(api.cashTransactions.getBalanceHistory, { accountId: accountId as Id<'accounts'> });
  const categoryBreakdown = useQuery(api.cashTransactions.getCategoryBreakdown, { accountId: accountId as Id<'accounts'> });
  const incomeVsExpenses = useQuery(api.cashTransactions.getIncomeVsExpensesByMonth, { accountId: accountId as Id<'accounts'> });

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<NonNullable<typeof transactions>[number] | null>(null);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);

  const groupedTransactions = useMemo(() => {
    if (!transactions) return [];
    return groupTransactionsByDate(transactions);
  }, [transactions]);

  const chartData = balanceHistory ?? [];
  const hasHistory = chartData.length > 0;

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className='flex-1'>
      <NavbarTitle>
        <div className='flex items-center gap-1.5 text-lg font-semibold'>
          <Link to='/accounts' className='text-gray-400 hover:text-gray-700 transition-colors'>
            Accounts
          </Link>
          <span className='text-gray-400'>/</span>
          <span>{account.name}</span>
        </div>
      </NavbarTitle>
      <NavbarActions>
        <Button
          size='sm'
          className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none mr-2'
          onClick={() => setIsAddTransactionOpen(true)}
        >
          <Plus className='h-3.5 w-3.5 mr-1.5' />
          Add Transaction
        </Button>
        <Button
          size='sm'
          className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'
          onClick={() => setIsEditAccountOpen(true)}
        >
          <Pencil className='h-3.5 w-3.5 mr-1.5' />
          Edit Account
        </Button>
      </NavbarActions>

      {/* Top Section: Balance Chart + Right Column Charts */}
      <div className='grid gap-6 md:grid-cols-3 mb-6'>
        {/* Balance Chart */}
        <Card className='md:col-span-2 h-full'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold text-gray-700'>Balance</CardTitle>
              <div className='text-right'>
                <span className='text-xl font-bold text-gray-900'>
                  {balance === undefined
                    ? '$0.00'
                    : (balance < 0 ? '-' : '') +
                      '$' +
                      Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className='text-xs text-gray-400 mb-0.5'>{account.type}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='h-72'>
            <div className='h-full w-full'>
              {!hasHistory ? (
                <div className='h-full flex items-center justify-center text-sm text-gray-400'>No transaction history yet</div>
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#bae6fd' stopOpacity={0.8} />
                        <stop offset='95%' stopColor='#bae6fd' stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey='date' axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#888888', fontSize: 12 }}
                      tickFormatter={(v) => (v >= 1000 || v <= -1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`)}
                      domain={['auto', 'auto']}
                      dx={-10}
                    />
                    <CartesianGrid vertical={false} stroke='#e5e7eb' />
                    <RechartsTooltip
                      formatter={(v: number) => [
                        `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        'Balance',
                      ]}
                    />
                    <Area type='monotone' dataKey='balance' stroke='#38bdf8' strokeWidth={3} fillOpacity={1} fill='url(#colorValue)' />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Account Info + Income vs Expenses */}
        <div className='space-y-4 h-full'>
          {/* Account Info */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-semibold text-gray-700'>Account Info</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1.5'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500'>Name</span>
                  <span className='font-medium text-gray-900'>{account.name}</span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500'>Type</span>
                  <span className='font-medium text-gray-900'>{account.type}</span>
                </div>
                {account.description && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>Description</span>
                    <span className='font-medium text-gray-900 text-right max-w-[60%]'>{account.description}</span>
                  </div>
                )}
                <div className='pt-1.5 border-t border-gray-100'>
                  <div className='flex justify-between items-center text-sm font-bold text-gray-900'>
                    <span>Balance</span>
                    <span>
                      {balance === undefined
                        ? '$0.00'
                        : (balance < 0 ? '-' : '') +
                          '$' +
                          Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income vs Expenses Chart */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-semibold text-gray-700'>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-30 w-full'>
                {!incomeVsExpenses || incomeVsExpenses.length === 0 ? (
                  <div className='h-full flex items-center justify-center text-sm text-gray-400'>No data yet</div>
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={incomeVsExpenses} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke='#e5e7eb' />
                      <XAxis dataKey='month' axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10 }} dy={5} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888888', fontSize: 10 }}
                        tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`)}
                        width={40}
                      />
                      <RechartsTooltip
                        formatter={(v: number, name: string) => [
                          `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                          name === 'income' ? 'Income' : 'Expenses',
                        ]}
                      />
                      <Bar dataKey='income' fill='#10b981' radius={[2, 2, 0, 0]} />
                      <Bar dataKey='expenses' fill='#ef4444' radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className='flex justify-center gap-4 mt-2 text-xs'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-sm bg-emerald-500' />
                  <span className='text-gray-500'>Income</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-2.5 h-2.5 rounded-sm bg-red-500' />
                  <span className='text-gray-500'>Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='grid gap-6 md:grid-cols-3'>
        {/* Left Column: Transactions */}
        <div className='md:col-span-2'>
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle className='text-lg font-semibold text-gray-700'>Transactions</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='overflow-auto max-h-125'>
                {transactions === undefined ? (
                  <div className='text-center text-gray-400 py-12 text-sm'>Loading...</div>
                ) : transactions.length === 0 ? (
                  <div className='text-center text-gray-400 py-12 text-sm'>No transactions yet</div>
                ) : (
                  groupedTransactions.map((group) => (
                    <div key={group.date}>
                      <div className='flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100'>
                        <span className='text-sm font-medium text-gray-500'>{formatDate(group.date)}</span>
                        <span className='text-sm font-medium text-gray-500'>
                          ${group.dailyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      {group.transactions.map((tx) => {
                        const categoryDisplay = getCategoryDisplay(tx.category);
                        return (
                          <div
                            key={tx._id}
                            className='flex items-center px-4 py-2 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer group'
                            onClick={() => setEditingTransaction(tx)}
                          >
                            <div className='w-10 shrink-0'>
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-xs ${getPayeeColor(tx.payee)}`}
                              >
                                {getPayeeInitial(tx.payee)}
                              </div>
                            </div>
                            <div className='w-1/3 min-w-0 pr-4'>
                              <div className='font-medium text-gray-900 truncate'>{tx.payee}</div>
                              {tx.description && <div className='text-xs text-gray-400 truncate'>{tx.description}</div>}
                            </div>
                            <div className='flex items-center gap-1.5 w-1/3 min-w-0 pr-4'>
                              <span className='text-sm'>{categoryDisplay.icon}</span>
                              <span className={`text-sm truncate ${categoryDisplay.color}`}>{categoryDisplay.name}</span>
                            </div>
                            <div className='flex items-center justify-end gap-2 w-1/3 min-w-0'>
                              <span
                                className={`text-sm font-semibold text-right ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}
                              >
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
              {transactions && transactions.length > 0 && (
                <div className='px-6 py-2.5 border-t border-gray-100 text-xs text-gray-400'>
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Top Spending */}
        <div>
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-semibold text-gray-700'>Top Spending</CardTitle>
            </CardHeader>
            <CardContent>
              {!categoryBreakdown || categoryBreakdown.length === 0 ? (
                <div className='flex items-center justify-center py-8 text-sm text-gray-400'>No spending data yet</div>
              ) : (
                <>
                  <div className='h-50'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie data={categoryBreakdown} cx='50%' cy='50%' innerRadius={55} outerRadius={80} paddingAngle={2} dataKey='value'>
                          {categoryBreakdown.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(v: number) => [
                            `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            'Spent',
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className='space-y-2 mt-2'>
                    {categoryBreakdown.map((cat, i) => {
                      const total = categoryBreakdown.reduce((s, c) => s + c.value, 0);
                      const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : '0';
                      return (
                        <div key={cat.name} className='flex items-center justify-between text-sm'>
                          <div className='flex items-center gap-2'>
                            <div
                              className='w-2.5 h-2.5 rounded-full shrink-0'
                              style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                            />
                            <span className='text-gray-600 truncate max-w-30'>{cat.name}</span>
                          </div>
                          <div className='flex items-center gap-2 shrink-0'>
                            <span className='text-gray-400 text-xs'>{pct}%</span>
                            <span className='font-medium text-gray-900'>
                              ${cat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddCashTransactionSheet
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accountId={accountId}
        accountType={account.type}
        userId={userId}
      />
      <EditCashTransactionSheet
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction}
        userId={userId}
        accountName={account.name}
        accountType={account.type}
      />
      <EditAccountSheet open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen} account={account} />
    </div>
  );
}
