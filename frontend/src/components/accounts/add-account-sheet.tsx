import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const accountFormSchema = z.object({
  name: z.string().min(1, 'Account name is required.').max(50, 'Account name must be less than 50 characters.'),
  description: z.string().max(200, 'Description must be less than 200 characters.').optional(),
  type: z.enum(['Cash', 'Investment', 'Real Estate', 'Credit Cards', 'Loans']),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AddAccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAccountSheet({ open, onOpenChange }: AddAccountSheetProps) {
  const { user } = useAuthenticator((context) => [context.user]);
  const createAccount = useMutation(api.accounts.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function onSubmit(data: AccountFormValues) {
    if (!user?.username) {
      console.error('No authenticated user found');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAccount({
        name: data.name,
        description: data.description || '',
        type: data.type,
        userId: user.username,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create account:', error);
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto min-w-[600px] sm:max-w-[480px]'>
        <SheetHeader className='mb-6'>
          <SheetTitle>Add Account</SheetTitle>
          <SheetDescription>Enter the details for the new account. Click save when you're done.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pl-4 pr-4'>
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

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an account type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Cash'>Cash</SelectItem>
                      <SelectItem value='Investment'>Investment</SelectItem>
                      <SelectItem value='Real Estate'>Real Estate</SelectItem>
                      <SelectItem value='Credit Cards'>Credit Cards</SelectItem>
                      <SelectItem value='Loans'>Loans</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='My checking account' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-start pt-4 space-x-2'>
              <Button type='submit' disabled={isSubmitting} className='bg-[#0067c0] hover:bg-[#0067c0]/80'>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
