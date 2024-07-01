'use client';
import * as React from 'react';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { Layout } from '@/components/layout/layout';
import LoadingPage from '../loading';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <Layout>
      <React.Suspense fallback={<LoadingPage />}>{children}</React.Suspense>
    </Layout>
  );
}
