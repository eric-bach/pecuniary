'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Trash2, Plus } from 'lucide-react';
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
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Account Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Book Value</TableHead>
                  <TableHead>Market Value</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>
                      No accounts found. Create your first account to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts?.map((account) => (
                    <TableRow key={account.accountId}>
                      <TableCell className='font-medium'>{account.name}</TableCell>
                      <TableCell>{account.type || 'N/A'}</TableCell>
                      <TableCell>{account.category}</TableCell>
                      <TableCell>{formatCurrency(account.balance)}</TableCell>
                      <TableCell>{formatCurrency(account.bookValue)}</TableCell>
                      <TableCell>{formatCurrency(account.marketValue)}</TableCell>
                      <TableCell>{formatDate(account.createdAt)}</TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end space-x-2'>
                          <Button variant='outline' size='sm' onClick={() => setEditingAccount(account)}>
                            <Pencil className='h-4 w-4' />
                          </Button>
                          <Button variant='outline' size='sm' onClick={() => setDeletingAccount(account)}>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditAccountDialog account={editingAccount} open={!!editingAccount} onClose={() => setEditingAccount(null)} />

      {/* Delete Dialog */}
      <DeleteAccountDialog account={deletingAccount} open={!!deletingAccount} onClose={() => setDeletingAccount(null)} />

      {/* Create Dialog */}
      <CreateAccountDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </div>
  );
}
