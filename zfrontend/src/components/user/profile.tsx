'use client';
import useAuthUser from '@/app/hooks/use-auth-user';
import { handleUpdatePassword } from '@/lib/cognitoActions';
import { Button } from '@nextui-org/react';
import { KeyIcon, TriangleAlertIcon, UserIcon } from 'lucide-react';
import { useFormState } from 'react-dom';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState } from 'react';

export default function UserProfile() {
  const user = useAuthUser();
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [status, dispatch] = useFormState(handleUpdatePassword, undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('new_password');
    const confirmNewPassword = formData.get('confirm_new_password');

    if (newPassword !== confirmNewPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // Continue with form submission
    dispatch(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6 min-w-[400px]'>
        <div className='mb-4'>
          <Label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Email
          </Label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <Input
                id='email'
                type='text'
                name='email'
                minLength={4}
                placeholder='Change email'
                required
                disabled={true}
                defaultValue={user?.email}
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              />
              <UserIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
            <div>
              <Input id='current_email' type='hidden' name='current_email' defaultValue={user?.email} />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Current Password
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='current_password'
                type='password'
                name='current_password'
                placeholder='Enter current password'
                required
                minLength={6}
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            New Password
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='new_password'
                type='password'
                name='new_password'
                placeholder='Enter new password'
                required
                minLength={6}
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Confirm New Password
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='confirm_new_password'
                type='password'
                name='confirm_new_password'
                placeholder='Confirm new password'
                required
                minLength={6}
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>

        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {status === 'error' && (
            <>
              <TriangleAlertIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>There was an error updating your password.</p>
            </>
          )}
          {passwordMatchError && (
            <>
              <TriangleAlertIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>Passwords do not match.</p>
            </>
          )}
          {status === 'success' && <p className='text-sm text-green-500'>Password has been updated successfully.</p>}
        </div>
      </div>

      <div className='mt-6 flex justify-end gap-4'>
        <Button type='submit' className='rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-colors'>
          Update
        </Button>
      </div>
    </form>
  );
}
