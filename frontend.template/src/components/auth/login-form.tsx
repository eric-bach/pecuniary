'use client';

import { useFormState } from 'react-dom';
import { handleSignIn } from '@/lib/cognitoActions';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(handleSignIn, undefined);

  return (
    <form action={dispatch} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>Please enter your email and password to login.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' placeholder='Your email' required type='text' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' required type='password' />

            <div className='text-sm text-right'>
              <a href='/auth/forgot-password' className='text-indigo-600 hover:text-indigo-500'>
                Forgot your password?
              </a>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='mt-10 text-center text-sm text-gray-500'>
              Not a member?{' '}
              <a href='/auth/signup' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' className='w-full bg-indigo-500 hover:bg-indigo-600 transition-colors'>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
