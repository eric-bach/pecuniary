import { useState, useMemo } from 'react';
import { NavbarActions, NavbarTitle } from '@/components/layout/navbar-portal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { Pencil } from 'lucide-react';
import { formatDate } from '@/lib/transaction-utils';
import { AddInvestmentTransactionSheet } from '@/components/accounts/add-investment-transaction-sheet';
import { EditAccountSheet } from '@/components/accounts/edit-account-sheet';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface Account {
  _id: Id<'accounts'>;
  name: string;
  description?: string;
  type: 'Cash' | 'Investment' | 'Real Estate' | 'Credit Cards' | 'Loans';
  currency?: 'USD' | 'CAD';
  userId: string;
}

interface InvestmentAccountDetailProps {
  accountId: string;
  account: Account;
  userId: string;
}

export function InvestmentAccountDetail({ accountId, account, userId }: InvestmentAccountDetailProps) {
  const rawTransactions = useQuery(api.investmentTransactions.listByAccount, { accountId: accountId as Id<'accounts'> });
  const transactions = rawTransactions
    ? [...rawTransactions].sort((a, b) => {
        const dateDiff = b.date.localeCompare(a.date);
        return dateDiff !== 0 ? dateDiff : b._creationTime - a._creationTime;
      })
    : undefined;
  const positions = useQuery(api.positions.listByAccount, { accountId: accountId as Id<'accounts'> });
  const accountSummary = useQuery(api.positions.getAccountSummary, { accountId: accountId as Id<'accounts'> });

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);

  const groupedTransactions = useMemo(() => {
    if (!transactions) return [];
    const groups: { date: string; transactions: typeof transactions }[] = [];
    const dateMap = new Map<string, typeof transactions>();

    for (const tx of transactions) {
      const existing = dateMap.get(tx.date);
      if (existing) {
        existing.push(tx);
      } else {
        dateMap.set(tx.date, [tx]);
      }
    }

    for (const [date, txs] of dateMap) {
      groups.push({ date, transactions: txs });
    }

    return groups.sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

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
          className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'
          onClick={() => setIsEditAccountOpen(true)}
        >
          <Pencil className='h-3.5 w-3.5 mr-1.5' />
          Edit Account
        </Button>
      </NavbarActions>

      {/* Top Section: Holdings + Right Column */}
      <div className='grid gap-6 md:grid-cols-3 mb-6'>
        {/* Holdings Card */}
        <Card className='md:col-span-2'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-semibold text-gray-700'>Holdings</CardTitle>
              <div className='text-right'>
                <div className='text-xs text-gray-400 mb-0.5'>
                  {account.type}
                  {account.currency ? ` (${account.currency})` : ''}
                </div>
                <span className='text-2xl font-bold text-gray-900'>
                  ${(accountSummary?.totalCostBasis ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className='text-xs text-gray-400 mt-0.5'>Cost Basis</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {!positions || positions.length === 0 ? (
                <div className='h-48 flex items-center justify-center text-sm text-gray-400'>No positions yet</div>
              ) : (
                <div className='space-y-2'>
                  {positions.map((pos) => {
                    const avgCost = pos.shares > 0 ? pos.costBasis / pos.shares : 0;
                    return (
                      <div key={pos._id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                        <div>
                          <div className='font-semibold text-gray-900 font-mono'>{pos.symbol}</div>
                          <div className='text-xs text-gray-500'>
                            {pos.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares @ $
                            {avgCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} avg
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-semibold text-gray-900'>
                            ${pos.costBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className='text-xs text-gray-400'>cost basis</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Account Info + Stats */}
        <div className='space-y-4'>
          {/* Account Info */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold text-gray-700'>Account Info</CardTitle>
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
                {account.currency && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>Currency</span>
                    <span className='font-medium text-gray-900'>{account.currency}</span>
                  </div>
                )}
                {account.description && (
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>Description</span>
                    <span className='font-medium text-gray-900 text-right max-w-[60%]'>{account.description}</span>
                  </div>
                )}
                <div className='pt-1.5 border-t border-gray-100'>
                  <div className='flex justify-between items-center text-sm font-bold text-gray-900'>
                    <span>Cost Basis</span>
                    <span>
                      $
                      {(accountSummary?.totalCostBasis ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Stats */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold text-gray-700'>Portfolio Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Positions</span>
                <span className='font-medium text-gray-900'>{accountSummary?.positionCount ?? 0}</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Total Dividends</span>
                <span className='font-medium text-emerald-600'>
                  $
                  {(accountSummary?.totalDividends ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Total Commissions</span>
                <span className='font-medium text-red-500'>
                  $
                  {(accountSummary?.totalCommissions ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>Transactions</span>
                <span className='font-medium text-gray-900'>{transactions?.length ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Transactions */}
      <div className='grid gap-6 md:grid-cols-3'>
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
              <div className='overflow-auto max-h-125'>
                {transactions === undefined ? (
                  <div className='text-center text-gray-400 py-12 text-sm'>Loading...</div>
                ) : transactions.length === 0 ? (
                  <div className='text-center text-gray-400 py-12 text-sm'>No transactions yet</div>
                ) : (
                  groupedTransactions.map((group) => (
                    <div key={group.date}>
                      <div className='flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100'>
                        <span className='text-sm font-medium text-gray-500'>{formatDate(group.date)}</span>
                      </div>
                      {group.transactions.map((tx) => {
                        const typeColors: Record<string, string> = {
                          buy: 'bg-emerald-500',
                          sell: 'bg-red-500',
                          dividend: 'bg-blue-500',
                          split: 'bg-purple-500',
                          transfer_in: 'bg-teal-500',
                          transfer_out: 'bg-orange-500',
                        };
                        const typeLabels: Record<string, string> = {
                          buy: 'Buy',
                          sell: 'Sell',
                          dividend: 'Dividend',
                          split: 'Split',
                          transfer_in: 'Transfer In',
                          transfer_out: 'Transfer Out',
                        };
                        const total = tx.shares * tx.unitPrice + (tx.commission ?? 0);

                        return (
                          <div key={tx._id} className='flex items-center px-4 py-2 border-b border-gray-50 hover:bg-gray-50/50 group'>
                            <div className='w-10 shrink-0'>
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-medium text-xs ${typeColors[tx.type]}`}
                              >
                                {tx.symbol.slice(0, 2)}
                              </div>
                            </div>
                            <div className='w-1/4 min-w-0 pr-4'>
                              <div className='font-semibold text-gray-900 font-mono'>{tx.symbol}</div>
                              <div className='text-xs text-gray-400'>{typeLabels[tx.type]}</div>
                            </div>
                            <div className='w-1/3 min-w-0 pr-4'>
                              <div className='text-sm text-gray-700'>
                                {tx.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares
                              </div>
                              <div className='text-xs text-gray-400'>
                                @ ${tx.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                              </div>
                            </div>
                            <div className='flex items-center justify-end gap-2 flex-1 min-w-0'>
                              <span
                                className={`text-sm font-semibold text-right ${
                                  tx.type === 'sell' || tx.type === 'dividend' ? 'text-emerald-600' : 'text-gray-900'
                                }`}
                              >
                                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
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
      </div>

      <AddInvestmentTransactionSheet
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        accountId={accountId}
        accountCurrency={account.currency}
        userId={userId}
      />
      <EditAccountSheet open={isEditAccountOpen} onOpenChange={setIsEditAccountOpen} account={account} />
    </div>
  );
}
