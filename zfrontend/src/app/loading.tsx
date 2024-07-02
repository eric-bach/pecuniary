import React from 'react';
import { Spinner } from '@nextui-org/react';

export default function LoadingPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Spinner size='lg' />
    </div>
  );
}
