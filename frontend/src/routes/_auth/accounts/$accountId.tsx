import { useState } from 'react';
import { NavbarActions, NavbarTitle } from '@/components/layout/navbar-portal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { Pencil } from 'lucide-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
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
} from 'recharts';
import { AddTransactionSheet } from '@/components/accounts/add-transaction-sheet';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_auth/accounts/$accountId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { accountId } = Route.useParams();
  const { user } = useAuthenticator((context) => [context.user]);
  const account = useQuery(api.accounts.get, { accountId: accountId as Id<'accounts'> });
  const rawTransactions = useQuery(api.transactions.listByAccount, { accountId: accountId as Id<'accounts'> });
  // Sort newest first by date string, then by creation time as tiebreaker
  const transactions = rawTransactions
    ? [...rawTransactions].sort((a, b) => {
        const dateDiff = b.date.localeCompare(a.date);
        return dateDiff !== 0 ? dateDiff : b._creationTime - a._creationTime;
      })
    : undefined;
  const balance = useQuery(api.transactions.getBalance, { accountId: accountId as Id<'accounts'> });
  const balanceHistory = useQuery(api.transactions.getBalanceHistory, { accountId: accountId as Id<'accounts'> });
  const categoryBreakdown = useQuery(api.transactions.getCategoryBreakdown, { accountId: accountId as Id<'accounts'> });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

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
          <span>{account?.name ?? '...'}</span>
        </div>
      </NavbarTitle>
      <NavbarActions>
        <Button size='sm' className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'>
          <Pencil className='h-3.5 w-3.5 mr-1.5' />
          Edit Account
        </Button>
      </NavbarActions>

      {/* Balance Chart */}
      <Card className='pt-6 mb-6'>
        <CardContent>
          <div className='flex justify-between items-start mb-4 px-2'>
            <div>
              <div className='text-sm text-gray-500 mb-0.5'>{account?.type ?? ''}</div>
              <div className='text-xl font-bold text-gray-400'>
                {balance === undefined
                  ? '$0.00'
                  : (balance < 0 ? '-' : '') +
                    '$' +
                    Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className='h-[250px] w-full mt-4'>
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

      {/* Bottom Section */}
      <div className='grid gap-6 md:grid-cols-3'>
        {/* Left Column: Transactions */}
        <div className='md:col-span-2'>
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle className='text-xl font-bold'>Transactions</CardTitle>
              <Button
                size='sm'
                className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'
                onClick={() => setIsAddTransactionOpen(true)}
              >
                Add Transaction
              </Button>
            </CardHeader>
            <CardContent className='p-0'>
              {/* Sticky header + scrollable body */}
              <div className='overflow-auto max-h-[560px]'>
                <Table>
                  <TableHeader className='sticky top-0 z-10 bg-white'>
                    <TableRow className='border-b border-gray-100'>
                      <TableHead className='text-xs text-gray-500 font-semibold pl-6'>Date</TableHead>
                      <TableHead className='text-xs text-gray-500 font-semibold'>Payee / Description</TableHead>
                      <TableHead className='text-xs text-gray-500 font-semibold'>Category</TableHead>
                      <TableHead className='text-xs text-gray-500 font-semibold text-right pr-6'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions === undefined ? (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center text-gray-400 py-12 text-sm'>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center text-gray-400 py-12 text-sm'>
                          No transactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx._id} className='hover:bg-gray-50/50'>
                          <TableCell className='text-sm text-gray-600 py-3 whitespace-nowrap pl-6'>{tx.date}</TableCell>
                          <TableCell className='text-sm py-3'>
                            <div className='font-medium text-gray-900'>{tx.payee}</div>
                            {tx.description && <div className='text-xs text-gray-400 mt-0.5'>{tx.description}</div>}
                          </TableCell>
                          <TableCell className='text-sm text-gray-500 py-3'>{tx.category ?? '—'}</TableCell>
                          <TableCell className='text-sm text-right py-3 pr-6 font-semibold'>
                            <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}>
                              {tx.type === 'credit' ? '+' : '-'}$
                              {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {transactions && transactions.length > 0 && (
                <div className='px-6 py-2.5 border-t border-gray-100 text-xs text-gray-400'>
                  {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Account Info */}
        <div className='space-y-4'>
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl font-bold'>Account Info</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500'>Name</span>
                  <span className='font-medium text-gray-900'>{account?.name ?? '—'}</span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-500'>Type</span>
                  <span className='font-medium text-gray-900'>{account?.type ?? '—'}</span>
                </div>
                {account?.description && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>Description</span>
                    <span className='font-medium text-gray-900 text-right max-w-[60%]'>{account.description}</span>
                  </div>
                )}
                <div className='pt-2 border-t border-gray-100'>
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

          {/* Spending Categories Pie Chart */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-xl font-bold'>Top Spending</CardTitle>
            </CardHeader>
            <CardContent>
              {!categoryBreakdown || categoryBreakdown.length === 0 ? (
                <div className='flex items-center justify-center py-8 text-sm text-gray-400'>No spending data yet</div>
              ) : (
                <>
                  <div className='h-[200px]'>
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
                            <span className='text-gray-600 truncate max-w-[120px]'>{cat.name}</span>
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
      <AddTransactionSheet
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accountId={accountId}
        userId={user?.username ?? ''}
      />
    </div>
  );
}
