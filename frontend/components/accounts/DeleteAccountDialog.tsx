'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteAccount } from '@/hooks/use-accounts';
import type { Account } from '@/types/account';

interface DeleteAccountDialogProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountDialog({ account, open, onClose }: DeleteAccountDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const deleteAccountMutation = useDeleteAccount();

  const isConfirmationValid = confirmationText.toLowerCase() === 'confirm';

  // Reset confirmation text when dialog opens/closes
  useEffect(() => {
    if (open) {
      setConfirmationText('');
    }
  }, [open]);

  const handleDelete = async () => {
    if (!account || !isConfirmationValid) return;

    try {
      await deleteAccountMutation.mutateAsync(account.accountId);
      onClose();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the account "{account?.name}"? This action cannot be undone and will permanently remove all
            associated data.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='space-y-2'>
            <Label htmlFor='confirmation'>
              Type <span className='font-semibold text-destructive'>confirm</span> to enable deletion:
            </Label>
            <Input
              id='confirmation'
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type 'confirm' here"
              className='w-full'
            />
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteAccountMutation.isPending || !isConfirmationValid}
          >
            {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
