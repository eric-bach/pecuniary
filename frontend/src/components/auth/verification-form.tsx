'use client';

import { handleSendEmailVerificationCode } from '@/lib/cognitoActions';
import { useFormState, useFormStatus } from 'react-dom';

export default function SendVerificationCode() {
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: '',
    errorMessage: '',
  });
  const { pending } = useFormStatus();
  return (
    <>
      <button className='mt-4 w-full' aria-disabled={pending} formAction={dispatch}>
        Resend Verification Code
      </button>
      <div className='flex h-8 items-end space-x-1'>
        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {response?.errorMessage && <p className='text-sm text-red-500'>{response.errorMessage}</p>}
          {response?.message && <p className='text-sm text-green-500'>{response.message}</p>}
        </div>
      </div>
    </>
  );
}
