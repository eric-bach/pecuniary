import { createFileRoute } from '@tanstack/react-router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { NavbarTitle, NavbarActions } from '@/components/layout/navbar-portal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatAmount } from '@/lib/transaction-utils';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Route = createFileRoute('/_auth/investments/')({
  component: InvestmentsPage,
});

function InvestmentsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const portfolioSummary = useQuery(api.positions.getPortfolioSummary, user?.username ? { userId: user.username } : 'skip');
  const isLoading = portfolioSummary === undefined;

  return (
    <div className='flex-1'>
      <NavbarTitle>Investments</NavbarTitle>
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Portfolio Value</h3>
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? '...' : formatAmount((portfolioSummary?.totalCostBasis || 0) + (portfolioSummary?.holdings.reduce((sum, h) => sum + h.unrealizedGain, 0) || 0))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Cost Basis</h3>
          <div className="text-2xl font-bold text-gray-900">
            {isLoading ? '...' : formatAmount(portfolioSummary?.totalCostBasis || 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Dividends</h3>
          <div className="text-2xl font-bold text-emerald-600">
            {isLoading ? '...' : `+${formatAmount(portfolioSummary?.totalDividends || 0)}`}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className='bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm'>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Current Holdings</h2>
          <Button size="sm" className="bg-[#0067c0] hover:bg-[#005bb5] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add transaction
          </Button>
        </div>
        
        {isLoading ? (
          <div className='text-center text-gray-400 py-12 text-sm'>Loading portfolio...</div>
        ) : !portfolioSummary || portfolioSummary.holdings.length === 0 ? (
          <div className='text-center text-gray-400 py-12 text-sm'>No investments yet</div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900 w-[100px]">Ticker</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Shares</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Avg Cost</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Current Price</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Current Value</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Unrealized Gain</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Total Dividends</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioSummary.holdings.map((holding) => {
                const isGain = holding.unrealizedGain >= 0;
                const gainPct = holding.costBasis > 0 ? (holding.unrealizedGain / holding.costBasis) * 100 : 0;
                const hasDividends = holding.totalDividends > 0;

                return (
                  <TableRow key={holding.symbol} className="hover:bg-gray-50/50 cursor-pointer">
                    <TableCell className="font-semibold text-gray-900">
                      {holding.symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      {holding.shares.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(holding.averageCost)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(holding.currentPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
                      {formatAmount(holding.currentValue)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${isGain ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isGain ? '+' : ''}{formatAmount(holding.unrealizedGain)}
                      <div className="text-xs font-normal opacity-80">
                        {isGain ? '+' : ''}{gainPct.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {hasDividends ? (
                        <span className="text-emerald-600">+{formatAmount(holding.totalDividends)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
