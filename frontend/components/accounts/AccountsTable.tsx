'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { useAccounts } from '@/hooks/use-accounts';
import type { Account } from '@/types/account';
import { EditAccountDialog } from './EditAccountDialog';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { CreateAccountDialog } from './CreateAccountDialog';

export function AccountsTable() {
  const { data: accounts, isLoading, error } = useAccounts();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryStyle = (category: string) => {
    const styles = {
      Banking: 'bg-blue-50 text-blue-700 ring-blue-700/10',
      Investment: 'bg-purple-50 text-purple-700 ring-purple-700/10',
      'Credit Card': 'bg-orange-50 text-orange-700 ring-orange-700/10',
      Asset: 'bg-emerald-50 text-emerald-700 ring-emerald-700/10',
    };
    return styles[category as keyof typeof styles] || 'bg-gray-50 text-gray-700 ring-gray-700/10';
  };

  const calculateProfitLoss = (account: Account) => {
    // For investment accounts, calculate P/L as market value - book value
    if (account.category === 'Investment' && account.marketValue !== undefined && account.bookValue !== undefined) {
      const pl = account.marketValue - account.bookValue;
      return {
        amount: pl,
        percentage: account.bookValue > 0 ? (pl / account.bookValue) * 100 : 0,
        isApplicable: true,
      };
    }

    // For asset accounts, also show P/L if both values are available
    if (account.category === 'Asset' && account.marketValue !== undefined && account.bookValue !== undefined) {
      const pl = account.marketValue - account.bookValue;
      return {
        amount: pl,
        percentage: account.bookValue > 0 ? (pl / account.bookValue) * 100 : 0,
        isApplicable: true,
      };
    }

    // For banking and credit card accounts, P/L doesn't really apply
    return {
      amount: 0,
      percentage: 0,
      isApplicable: false,
    };
  };

  const formatProfitLoss = (pl: ReturnType<typeof calculateProfitLoss>) => {
    if (!pl.isApplicable) {
      return <span className='text-muted-foreground text-sm'>—</span>;
    }

    const isPositive = pl.amount >= 0;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const sign = isPositive ? '+' : '';

    return (
      <div className={`font-medium ${colorClass}`}>
        <div>
          {sign}
          {formatCurrency(pl.amount)}
        </div>
        <div className='text-xs font-normal'>
          {sign}
          {pl.percentage.toFixed(2)}%
        </div>
      </div>
    );
  };

  const sortAccountsByCategory = (accounts: Account[]) => {
    const categoryOrder = {
      Banking: 1,
      'Credit Card': 2,
      Investment: 3,
      Asset: 4,
    };

    return [...accounts].sort((a, b) => {
      const orderA = categoryOrder[a.category as keyof typeof categoryOrder] || 999;
      const orderB = categoryOrder[b.category as keyof typeof categoryOrder] || 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If same category, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-red-600'>Error loading accounts: {error instanceof Error ? error.message : 'Unknown error'}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='w-full max-w-none space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Account Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Account
        </Button>
      </div>

      <div className='w-full'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold'>Accounts</h3>
        </div>
        <div className='w-full min-w-full overflow-x-auto' style={{ width: '100%' }}>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : (
            <Table className='!w-full table-fixed' style={{ width: '100%' }}>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Details</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Profit/Loss</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                      No accounts found. Create your first account to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortAccountsByCategory(accounts || []).map((account) => (
                    <TableRow key={account.accountId}>
                      <TableCell>
                        <div className='space-y-1'>
                          <div className='font-medium text-foreground'>{account.name}</div>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryStyle(
                                account.category
                              )}`}
                            >
                              {account.category}
                            </span>
                            <span>•</span>
                            <span>{account.type || 'Unknown'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='font-medium'>{formatCurrency(account.balance || account.marketValue || account.bookValue)}</div>
                      </TableCell>
                      <TableCell>{formatProfitLoss(calculateProfitLoss(account))}</TableCell>
                      <TableCell className='text-muted-foreground'>{formatDate(account.createdAt)}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                              <Pencil className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingAccount(account)} className='text-red-600 focus:text-red-600'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditAccountDialog account={editingAccount} open={!!editingAccount} onClose={() => setEditingAccount(null)} />

      {/* Delete Dialog */}
      <DeleteAccountDialog account={deletingAccount} open={!!deletingAccount} onClose={() => setDeletingAccount(null)} />

      {/* Create Dialog */}
      <CreateAccountDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </div>
  );
}
