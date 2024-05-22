'use client';

import { useFormState } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { handleSendEmailVerification } from '@/lib/cognitoActions';
import { Input } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';

export default function VerifyForm() {
  const [result, dispatch] = useFormState(handleSendEmailVerification, { message: '', errorMessage: '' });

  const params = useSearchParams();
  const email = params.get('email') ?? '';

  return (
    <form action={dispatch} className='space-y-3 min-w-[400px]'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Verify Email</CardTitle>
          <CardDescription className='pt-4'>
            Thanks for signing up! We&#39;ve sent an email to your inbox with a link to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm text-muted-foreground'>Please check your email and click on the verification link to proceed.</p>
          </div>
          <div className='space-y-2'>
            <div>
              <Input id='email' type='hidden' name='email' defaultValue={email} />
            </div>
            <p className='mt-4 text-center text-sm text-gray-500'>
              Didn&#39;t receive an email?
              <Button type='submit' variant='ghost' className='font-semibold hover:bg-transparent text-indigo-600 hover:text-indigo-600'>
                Resend
              </Button>
            </p>
          </div>
          {(result.message || result.errorMessage) && (
            <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
              {result.errorMessage && (
                <>
                  <TriangleAlertIcon className='h-5 w-5 text-red-500' />
                  <p className='text-sm text-red-500'>Could not resend verification email.</p>
                </>
              )}
              {result.message && <p className='text-sm text-green-500'>{result.message}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href='/'
            className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-indigo-500 hover:bg-indigo-600 transition-colors')}
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
