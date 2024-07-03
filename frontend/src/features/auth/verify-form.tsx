'use client';

import { useFormState } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { handleSendEmailVerification } from '@/lib/cognitoActions';
import { useSearchParams } from 'next/navigation';
import { TriangleAlertIcon } from 'lucide-react';
import { Suspense } from 'react';
import { Input } from '../../components/ui/input';

function Search() {
  const params = useSearchParams();
  const email = params.get('email') ?? '';

  return <Input id='email' type='hidden' name='email' defaultValue={email} />;
}

export default function VerifyForm() {
  const [result, dispatch] = useFormState(handleSendEmailVerification, { message: '', errorMessage: '' });

  return (
    <form action={dispatch} className='space-y-3 min-w-[400px] max-w-[540px]'>
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
              <Suspense>
                <Search />
              </Suspense>
            </div>
            <p className='mt-4 text-center text-sm'>
              Didn&#39;t receive an email?
              <Button type='submit' className='font-semibold bg-transparent hover:bg-transparent text-slate-600'>
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
            href='/dashboard'
            className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-slate-800 hover:bg-slate-600 transition-colors')}
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </form>
  );
}
