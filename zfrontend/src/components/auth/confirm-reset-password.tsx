'use client';

import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { handleConfirmResetPassword } from '@/lib/cognitoActions';
import { AtSignIcon, CircleCheckIcon, KeyIcon, TriangleAlertIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export default function ConfirmResetPasswordForm() {
  const [errorMessage, dispatch] = useFormState(handleConfirmResetPassword, undefined);

  return (
    <form action={dispatch} className='space-y-3 min-w-[400px]'>
      <Card>
        <CardHeader>
          <CardTitle className=' text-2xl'>Reset Password</CardTitle>
          <CardDescription>Please enter a new password</CardDescription>
        </CardHeader>

        <CardContent className='w-full'>
          <Label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='email'>
            Email
          </Label>
          <Input id='email' type='email' name='email' placeholder='Enter your email address' required />
          <AtSignIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />

          <Label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='password'>
            New Password
          </Label>
          <Input id='password' type='password' name='password' placeholder='Enter password' required minLength={6} />
          <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />

          <Label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='code'>
            Confirmation Code
          </Label>
          <Input id='code' type='text' name='code' placeholder='Enter code' required minLength={6} />
          <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />

          {errorMessage && (
            <div className='flex h-8 items-end space-x-1'>
              <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
                <TriangleAlertIcon className='h-5 w-5 text-red-500' />
                <p className='text-sm text-red-500'>{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <ResetPasswordButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function ResetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='mt-4 w-full text-white bg-indigo-500 hover:bg-indigo-600' aria-disabled={pending}>
      Reset Password <CircleCheckIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
