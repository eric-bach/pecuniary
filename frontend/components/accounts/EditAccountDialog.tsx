'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUpdateAccount } from '@/hooks/use-accounts';
import { categories, getTypesForCategory, type Category } from '@/lib/account-constants';
import type { Account } from '@/types/account';

interface EditAccountDialogProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}

export function EditAccountDialog({ account, open, onClose }: EditAccountDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const updateAccountMutation = useUpdateAccount();

  // Get available types based on selected category
  const availableTypes = category ? getTypesForCategory(category as Category) : [];

  useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type || '');
      setCategory(account.category);
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;

    try {
      await updateAccountMutation.mutateAsync({
        accountId: account.accountId,
        name,
        type,
        category,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setName('');
    setType('');
    setCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>Make changes to the account details below. Note: Category cannot be changed.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' value={name} onChange={(e) => setName(e.target.value)} className='col-span-3' required />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Category</Label>
              <Select value={category} disabled>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Type</Label>
              <Select value={type} onValueChange={setType} disabled={!category} required>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder={category ? 'Select a type' : 'Select category first'} />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((typeOption) => (
                    <SelectItem key={typeOption} value={typeOption}>
                      {typeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={updateAccountMutation.isPending}>
              {updateAccountMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
