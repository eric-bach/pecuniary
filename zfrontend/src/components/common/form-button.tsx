'use client';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' isLoading={pending}>
      {children}
    </Button>
  );
}
