'use client';

import { useFormState } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { handleSignUp } from '@/lib/cognitoActions';
import { useState } from 'react';

export default function SignUpForm() {
  const [errorMessage, dispatch] = useFormState(handleSignUp, undefined);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }

    // Continue with form submission
    const formData = new FormData(e.currentTarget);
    dispatch(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign up</CardTitle>
          <CardDescription>Please create an account</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' placeholder='Your email' required type='text' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' required type='password' value={password} onChange={handlePasswordChange} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password-confirm'>Confirm Password</Label>
            <Input
              id='password-confirm'
              name='password-confirm'
              required
              type='password'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          {passwordMatchError && <p className='text-red-500'>{passwordMatchError}</p>}
          <div className='space-y-2'>
            <p className='mt-10 text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <a href='/auth/login' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
                Log in
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' className='w-full hover:bg-blue-500 transition-colors'>
            Create account
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
