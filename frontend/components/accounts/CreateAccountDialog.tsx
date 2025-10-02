'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateAccount } from '@/hooks/use-accounts';
import { categories, getTypesForCategory, type Category } from '@/lib/account-constants';

interface CreateAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAccountDialog({ open, onClose }: CreateAccountDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const createAccountMutation = useCreateAccount();

  // Get available types based on selected category
  const availableTypes = category ? getTypesForCategory(category as Category) : [];

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // Reset type when category changes
    setType('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createAccountMutation.mutateAsync({
        name,
        type,
        category,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create account:', error);
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
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>Add a new account to your portfolio.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='create-name' className='text-right'>
                Name
              </Label>
              <Input
                id='create-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='col-span-3'
                placeholder='e.g., Main Checking Account'
                required
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Category</Label>
              <Select value={category} onValueChange={handleCategoryChange} required>
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
            <Button type='submit' disabled={createAccountMutation.isPending}>
              {createAccountMutation.isPending ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
