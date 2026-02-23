import { useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddAccountSheet } from '@/components/accounts/add-account-sheet';
import { NavbarTitle, NavbarActions } from '@/components/layout/navbar-portal';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export const Route = createFileRoute('/_auth/accounts/')({
  component: AccountsPage,
});

// Real accounts will be queried from Convex.

function AccountTableSection({
  title,
  accounts,
  colorClass,
  balances,
  defaultExpanded = true,
}: {
  title: string;
  accounts: any[];
  colorClass: string;
  balances: Record<string, number>;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const router = useRouter();

  if (!accounts || accounts.length === 0) return null;

  return (
    <div className='mb-6'>
      <div className='flex flex-row items-center justify-between pb-2 mb-2'>
        <div className='flex items-center gap-2'>
          <h3
            className='text-lg font-semibold flex items-center cursor-pointer select-none hover:text-gray-700'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className='mr-2 h-5 w-5 text-gray-500' /> : <ChevronRight className='mr-2 h-5 w-5 text-gray-500' />}
            {title}
          </h3>
        </div>
        <div className='font-bold text-xl'>{formatBalance(accounts.reduce((sum, a) => sum + (balances[a._id] ?? 0), 0))}</div>
      </div>

      {isExpanded && (
        <div className='bg-white rounded-lg'>
          <Table>
            <TableBody>
              {accounts.map((item, i) => (
                <TableRow
                  key={item._id}
                  className='hover:bg-gray-50/50 cursor-pointer'
                  onClick={() => router.navigate({ to: '/accounts/$accountId', params: { accountId: item._id } })}
                >
                  <TableCell className='w-[60px] py-4'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${colorClass}`}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <div className='font-semibold text-gray-900'>{item.name}</div>
                    <div className='text-xs text-gray-500 mt-0.5'>{item.description || item.type}</div>
                  </TableCell>
                  <TableCell className='text-right py-4'>
                    <div className='font-semibold text-gray-900'>{formatBalance(balances[item._id] ?? 0)}</div>
                    <div className='text-xs text-gray-400 mt-0.5'>-</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function formatBalance(value: number): string {
  const abs = Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (value < 0 ? '-' : '') + '$' + abs;
}

function AccountsPage() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const { user } = useAuthenticator((context) => [context.user]);
  const userAccounts = useQuery(api.accounts.list, user?.username ? { userId: user.username } : 'skip');
  const balances = useQuery(api.cashTransactions.getBalancesByUser, user?.username ? { userId: user.username } : 'skip') ?? {};
  const totalHistory = useQuery(api.cashTransactions.getTotalBalanceHistory, user?.username ? { userId: user.username } : 'skip');

  const chartData = totalHistory ?? [];
  const hasHistory = chartData.length > 0;
  const totalBalance = Object.values(balances).reduce((s, v) => s + v, 0);

  const cashAccounts = userAccounts?.filter((a) => a.type === 'Cash') || [];
  const investmentAccounts = userAccounts?.filter((a) => a.type === 'Investment') || [];
  const realEstateAccounts = userAccounts?.filter((a) => a.type === 'Real Estate') || [];
  const creditCardAccounts = userAccounts?.filter((a) => a.type === 'Credit Cards') || [];
  const loanAccounts = userAccounts?.filter((a) => a.type === 'Loans') || [];

  return (
    <div className='flex-1'>
      <NavbarTitle>Accounts</NavbarTitle>
      <NavbarActions>
        <Button
          onClick={() => setIsAddAccountOpen(true)}
          size='sm'
          className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'
        >
          <Plus className='h-3.5 w-3.5 mr-1.5' />
          Add account
        </Button>
      </NavbarActions>

      {/* Chart */}
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base font-semibold text-gray-700'>Net Worth</CardTitle>
            <span className='text-2xl font-bold text-gray-900'>{formatBalance(totalBalance)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-[250px] w-full'>
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

      <div className='grid gap-6 md:grid-cols-3'>
        {/* Left Column: Accounts List */}
        <div className='md:col-span-2'>
          <AccountTableSection title='Cash' accounts={cashAccounts} colorClass='bg-emerald-600' balances={balances} />
          <AccountTableSection title='Credit Cards' accounts={creditCardAccounts} colorClass='bg-red-500' balances={balances} />
          <AccountTableSection title='Investments' accounts={investmentAccounts} colorClass='bg-blue-600' balances={balances} />
          <AccountTableSection title='Real Estate' accounts={realEstateAccounts} colorClass='bg-purple-600' balances={balances} />
          <AccountTableSection title='Loans' accounts={loanAccounts} colorClass='bg-orange-500' balances={balances} />
        </div>

        {/* Right Column: Summary Box */}
        <div className='space-y-4'>
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle className='text-xl font-bold'>Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-8'>
              {/* Assets Breakdown */}
              <div className='space-y-3'>
                {(() => {
                  const cash = cashAccounts.reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                  const investments = investmentAccounts.reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                  const realEstate = realEstateAccounts.reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                  const total = cash + investments + realEstate;
                  const pct = (v: number) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '0%');
                  return (
                    <>
                      <div className='flex justify-between items-center text-sm font-bold text-gray-900'>
                        <span>Assets</span>
                        <span>{formatBalance(total)}</span>
                      </div>
                      <div className='h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex gap-0.5'>
                        {total > 0 && <div className='h-full bg-[#27AE60] rounded-full' style={{ width: pct(cash) }} />}
                        {total > 0 && <div className='h-full bg-[#56CCF2] rounded-full' style={{ width: pct(investments) }} />}
                        {total > 0 && <div className='h-full bg-[#9B51E0] rounded-full' style={{ width: pct(realEstate) }} />}
                      </div>
                      <div className='space-y-2.5 pt-3'>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-[#27AE60]'></div>
                            <span className='text-gray-600'>Cash</span>
                          </div>
                          <span className='font-medium text-gray-900'>{formatBalance(cash)}</span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-[#56CCF2]'></div>
                            <span className='text-gray-600'>Investments</span>
                          </div>
                          <span className='font-medium text-gray-900'>{formatBalance(investments)}</span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-[#9B51E0]'></div>
                            <span className='text-gray-600'>Real Estate</span>
                          </div>
                          <span className='font-medium text-gray-900'>{formatBalance(realEstate)}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Liabilities Breakdown */}
              <div className='space-y-3 pt-2'>
                {(() => {
                  const creditCards = creditCardAccounts.reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                  const loans = loanAccounts.reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                  const total = creditCards + loans;
                  const pct = (v: number) => (total !== 0 ? `${(Math.abs(v / total) * 100).toFixed(1)}%` : '0%');
                  return (
                    <>
                      <div className='flex justify-between items-center text-sm font-bold text-gray-900'>
                        <span>Liabilities</span>
                        <span>{formatBalance(total)}</span>
                      </div>
                      <div className='h-2.5 w-full rounded-full bg-gray-100 overflow-hidden flex gap-0.5'>
                        {total !== 0 && <div className='h-full bg-[#EB5757] rounded-full' style={{ width: pct(creditCards) }} />}
                        {total !== 0 && <div className='h-full bg-[#F2C94C] rounded-full' style={{ width: pct(loans) }} />}
                      </div>
                      <div className='space-y-2.5 pt-3'>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-[#EB5757]'></div>
                            <span className='text-gray-600'>Credit Cards</span>
                          </div>
                          <span className='font-medium text-gray-900'>{formatBalance(creditCards)}</span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-[#F2C94C]'></div>
                            <span className='text-gray-600'>Loans</span>
                          </div>
                          <span className='font-medium text-gray-900'>{formatBalance(loans)}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddAccountSheet open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen} />
    </div>
  );
}
