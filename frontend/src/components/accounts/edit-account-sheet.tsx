import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Trash2 } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const accountFormSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100, 'Name must be less than 100 characters.'),
  description: z.string().max(500, 'Description must be less than 500 characters.').optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface Account {
  _id: Id<'accounts'>;
  name: string;
  description?: string;
  type: 'Cash' | 'Investment' | 'Real Estate' | 'Credit Cards' | 'Loans';
  userId: string;
}

interface EditAccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

export function EditAccountSheet({ open, onOpenChange, account }: EditAccountSheetProps) {
  const navigate = useNavigate();
  const updateAccount = useMutation(api.accounts.update);
  const deleteAccount = useMutation(api.accounts.remove);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Populate form when account changes or sheet opens
  useEffect(() => {
    if (open && account) {
      form.reset({
        name: account.name,
        description: account.description ?? '',
      });
      setShowDeleteConfirm(false);
      setConfirmText('');
    }
  }, [open, account]);

  // Reset delete confirmation state when sheet closes
  useEffect(() => {
    if (!open) {
      setShowDeleteConfirm(false);
      setConfirmText('');
    }
  }, [open]);

  async function onSubmit(data: AccountFormValues) {
    if (!account) return;

    setIsSubmitting(true);
    try {
      await updateAccount({
        accountId: account._id,
        name: data.name,
        description: data.description || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update account:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!account || confirmText.toLowerCase() !== 'confirm') return;

    setIsDeleting(true);
    try {
      await deleteAccount({ accountId: account._id });
      onOpenChange(false);
      navigate({ to: '/accounts' });
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-[600px] sm:max-w-[480px]'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>Update the account details. Click save when you're done.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pl-4 pr-4'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Checking Account' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type (read-only) */}
            <div className='space-y-2'>
              <FormLabel>Type</FormLabel>
              <Input value={account?.type ?? ''} disabled className='bg-gray-50 text-gray-500' />
              <p className='text-xs text-gray-400'>Account type cannot be changed after creation.</p>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className='text-gray-400 font-normal text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Main checking account' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-between pt-4'>
              <div className='flex space-x-2'>
                <Button type='submit' disabled={isSubmitting || isDeleting} className='bg-[#0067c0] hover:bg-[#0067c0]/80'>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting || isDeleting}>
                  Cancel
                </Button>
              </div>
              {!showDeleteConfirm && (
                <Button
                  type='button'
                  variant='destructive'
                  disabled={isSubmitting || isDeleting}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className='h-4 w-4 mr-1.5' />
                  Delete
                </Button>
              )}
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className='mt-6 p-4 border border-red-200 rounded-lg bg-red-50'>
                <div className='text-sm font-semibold text-red-800 mb-2'>Delete Account</div>
                <p className='text-sm text-red-700 mb-3'>
                  This will permanently delete this account and all associated transactions. This action cannot be undone.
                </p>
                <p className='text-sm text-red-700 mb-3'>
                  Type <span className='font-mono font-bold'>confirm</span> to delete:
                </p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type confirm'
                  className='mb-3'
                  autoFocus
                />
                <div className='flex space-x-2'>
                  <Button
                    type='button'
                    variant='destructive'
                    disabled={confirmText.toLowerCase() !== 'confirm' || isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setConfirmText('');
                    }}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
