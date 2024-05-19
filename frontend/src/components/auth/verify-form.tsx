'use client';

import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function VerifyForm() {
  return (
    <div className='space-y-3 min-w-[400px]'>
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
            <p className='mt-4 text-center text-sm text-gray-500'>
              Didn&#39;t receive an email?
              <Button type='submit' variant='ghost' className='font-semibold hover:bg-transparent text-indigo-600 hover:text-indigo-600'>
                Resend
              </Button>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href='/' className={cn(buttonVariants({ variant: 'default' }), 'w-full hover:bg-blue-500 transition-colors')}>
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
