import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavbarTitle } from '@/components/layout/navbar-portal';

export const Route = createFileRoute('/_auth/dashboard/')({
  component: DashboardPage,
});

function formatCurrency(value: number): string {
  const abs = Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (value < 0 ? '-' : '') + '$' + abs;
}

function formatMonthLabel(month: string): string {
  // "YYYY-MM" -> "MMM 'YY"
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

function StatCard({
  label,
  value,
  sub,
  icon,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <Card className='shadow-sm border-gray-100'>
      <CardContent className='pt-6'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm text-gray-500 font-medium'>{label}</p>
            <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
            {sub && (
              <p
                className={`text-xs mt-1 font-medium flex items-center gap-1 ${positive === true ? 'text-emerald-600' : positive === false ? 'text-red-500' : 'text-gray-400'}`}
              >
                {positive === true ? <TrendingUp className='h-3 w-3' /> : positive === false ? <TrendingDown className='h-3 w-3' /> : null}
                {sub}
              </p>
            )}
          </div>
          <div className='p-2.5 rounded-xl bg-[#0067c0]/10 text-[#0067c0]'>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const userId = user?.username;

  const userAccounts = useQuery(api.accounts.list, userId ? { userId } : 'skip');
  const balances = useQuery(api.transactions.getBalancesByUser, userId ? { userId } : 'skip') ?? {};
  const totalHistory = useQuery(api.transactions.getTotalBalanceHistory, userId ? { userId } : 'skip');
  const spendingByMonth = useQuery(api.transactions.getSpendingByMonth, userId ? { userId } : 'skip');
  const recentTransactions = useQuery(api.transactions.getRecentByUser, userId ? { userId, limit: 8 } : 'skip');

  const totalNetWorth = Object.values(balances).reduce((s, v) => s + v, 0);
  const chartData = totalHistory ?? [];
  const spendingData = (spendingByMonth ?? []).slice(-6).map((d) => ({
    ...d,
    label: formatMonthLabel(d.month),
  }));

  // Current month spending
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthSpending = spendingByMonth?.find((d) => d.month === currentMonth)?.total ?? 0;

  // Assets vs liabilities
  const assetTypes = ['Cash', 'Investment', 'Real Estate'];
  const liabilityTypes = ['Credit Cards', 'Loans'];
  const totalAssets = (userAccounts ?? []).filter((a) => assetTypes.includes(a.type)).reduce((s, a) => s + (balances[a._id] ?? 0), 0);
  const totalLiabilities = (userAccounts ?? [])
    .filter((a) => liabilityTypes.includes(a.type))
    .reduce((s, a) => s + (balances[a._id] ?? 0), 0);

  return (
    <div className='flex-1 pb-10'>
      <NavbarTitle>Dashboard</NavbarTitle>

      {/* Stat cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
        <StatCard label='Net Worth' value={formatCurrency(totalNetWorth)} icon={<Wallet className='h-5 w-5' />} />
        <StatCard
          label='Total Assets'
          value={formatCurrency(totalAssets)}
          positive={totalAssets > 0}
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <StatCard
          label='Total Liabilities'
          value={formatCurrency(Math.abs(totalLiabilities))}
          positive={totalLiabilities >= 0}
          icon={<TrendingDown className='h-5 w-5' />}
        />
        <StatCard label='Spending This Month' value={formatCurrency(thisMonthSpending)} icon={<ArrowDownLeft className='h-5 w-5' />} />
      </div>

      {/* 2-column layout */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* LEFT COLUMN — 2/3 width */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Net Worth Chart */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-base font-semibold text-gray-700'>Net Worth Over Time</CardTitle>
                <span className='text-2xl font-bold text-gray-900'>{formatCurrency(totalNetWorth)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-[220px] w-full'>
                {chartData.length === 0 ? (
                  <div className='h-full flex items-center justify-center text-sm text-gray-400'>No transaction history yet</div>
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id='networthGradient' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#0067c0' stopOpacity={0.25} />
                          <stop offset='95%' stopColor='#0067c0' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke='#f0f0f0' />
                      <XAxis dataKey='date' axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={8} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickFormatter={(v) => (Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`)}
                        domain={['auto', 'auto']}
                        dx={-4}
                        width={52}
                      />
                      <Tooltip
                        formatter={(v: number) => [formatCurrency(v), 'Net Worth']}
                        contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}
                      />
                      <Area
                        type='monotone'
                        dataKey='balance'
                        stroke='#0067c0'
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill='url(#networthGradient)'
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Spending by Month */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold text-gray-700'>Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[200px] w-full'>
                {spendingData.length === 0 ? (
                  <div className='h-full flex items-center justify-center text-sm text-gray-400'>No spending data yet</div>
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={spendingData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={28}>
                      <CartesianGrid vertical={false} stroke='#f0f0f0' />
                      <XAxis dataKey='label' axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={8} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`)}
                        width={52}
                        dx={-4}
                      />
                      <Tooltip
                        formatter={(v: number) => [formatCurrency(v), 'Spending']}
                        contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}
                        cursor={{ fill: '#f0f4ff' }}
                      />
                      <Bar dataKey='total' fill='#0067c0' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base font-semibold text-gray-700'>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              {!recentTransactions || recentTransactions.length === 0 ? (
                <div className='py-12 text-center text-sm text-gray-400'>No transactions yet</div>
              ) : (
                <div className='divide-y divide-gray-50'>
                  {recentTransactions.map((tx) => (
                    <div key={tx._id} className='flex items-center justify-between px-6 py-3 hover:bg-gray-50/60 transition-colors'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {tx.type === 'credit' ? <ArrowUpRight className='h-4 w-4' /> : <ArrowDownLeft className='h-4 w-4' />}
                        </div>
                        <div>
                          <div className='font-medium text-sm text-gray-900'>{tx.payee}</div>
                          <div className='text-xs text-gray-400 mt-0.5'>
                            {tx.accountName} · {tx.category || 'Uncategorized'} · {tx.date}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold tabular-nums ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.type === 'credit' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — 1/3 width */}
        <div className='space-y-6'>
          {/* Assets & Liabilities Summary */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold text-gray-700'>Net Worth Breakdown</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Assets */}
              {(() => {
                const cash = (userAccounts ?? []).filter((a) => a.type === 'Cash').reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                const investments = (userAccounts ?? [])
                  .filter((a) => a.type === 'Investment')
                  .reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                const realEstate = (userAccounts ?? [])
                  .filter((a) => a.type === 'Real Estate')
                  .reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                const assetTotal = cash + investments + realEstate;
                const pct = (v: number) => (assetTotal > 0 ? `${((v / assetTotal) * 100).toFixed(1)}%` : '0%');
                return (
                  <div className='space-y-3'>
                    <div className='flex justify-between text-sm font-semibold text-gray-800'>
                      <span>Assets</span>
                      <span>{formatCurrency(assetTotal)}</span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden flex gap-0.5'>
                      {assetTotal > 0 && <div className='h-full bg-emerald-500 rounded-full' style={{ width: pct(cash) }} />}
                      {assetTotal > 0 && <div className='h-full bg-blue-500 rounded-full' style={{ width: pct(investments) }} />}
                      {assetTotal > 0 && <div className='h-full bg-purple-500 rounded-full' style={{ width: pct(realEstate) }} />}
                    </div>
                    <div className='space-y-2'>
                      {[
                        { label: 'Cash', value: cash, color: 'bg-emerald-500' },
                        { label: 'Investments', value: investments, color: 'bg-blue-500' },
                        { label: 'Real Estate', value: realEstate, color: 'bg-purple-500' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className={`w-2 h-2 rounded-full ${color}`} />
                            <span className='text-gray-500'>{label}</span>
                          </div>
                          <span className='font-medium text-gray-800'>{formatCurrency(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className='border-t border-gray-100' />

              {/* Liabilities */}
              {(() => {
                const creditCards = (userAccounts ?? [])
                  .filter((a) => a.type === 'Credit Cards')
                  .reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                const loans = (userAccounts ?? []).filter((a) => a.type === 'Loans').reduce((s, a) => s + (balances[a._id] ?? 0), 0);
                const liabTotal = creditCards + loans;
                const pct = (v: number) => (liabTotal !== 0 ? `${(Math.abs(v / liabTotal) * 100).toFixed(1)}%` : '0%');
                return (
                  <div className='space-y-3'>
                    <div className='flex justify-between text-sm font-semibold text-gray-800'>
                      <span>Liabilities</span>
                      <span>{formatCurrency(liabTotal)}</span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-100 overflow-hidden flex gap-0.5'>
                      {liabTotal !== 0 && <div className='h-full bg-red-400 rounded-full' style={{ width: pct(creditCards) }} />}
                      {liabTotal !== 0 && <div className='h-full bg-orange-400 rounded-full' style={{ width: pct(loans) }} />}
                    </div>
                    <div className='space-y-2'>
                      {[
                        { label: 'Credit Cards', value: creditCards, color: 'bg-red-400' },
                        { label: 'Loans', value: loans, color: 'bg-orange-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-2'>
                            <div className={`w-2 h-2 rounded-full ${color}`} />
                            <span className='text-gray-500'>{label}</span>
                          </div>
                          <span className='font-medium text-gray-800'>{formatCurrency(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Accounts list */}
          <Card className='shadow-sm border-gray-100'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base font-semibold text-gray-700'>Accounts</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              {!userAccounts || userAccounts.length === 0 ? (
                <div className='py-8 text-center text-sm text-gray-400'>No accounts yet</div>
              ) : (
                <div className='divide-y divide-gray-50'>
                  {userAccounts.map((account) => {
                    const balance = balances[account._id] ?? 0;
                    const colorMap: Record<string, string> = {
                      Cash: 'bg-emerald-600',
                      Investment: 'bg-blue-600',
                      'Real Estate': 'bg-purple-600',
                      'Credit Cards': 'bg-red-500',
                      Loans: 'bg-orange-500',
                    };
                    return (
                      <div
                        key={account._id}
                        className='flex items-center gap-3 px-6 py-3 hover:bg-gray-50/60 cursor-pointer transition-colors'
                        onClick={() => router.navigate({ to: '/accounts/$accountId', params: { accountId: account._id } })}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${colorMap[account.type] ?? 'bg-gray-400'}`}
                        >
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-sm text-gray-900 truncate'>{account.name}</div>
                          <div className='text-xs text-gray-400'>{account.type}</div>
                        </div>
                        <div className={`text-sm font-semibold tabular-nums ${balance < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                          {formatCurrency(balance)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
