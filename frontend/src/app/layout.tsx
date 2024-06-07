import type { Metadata } from 'next';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { Providers } from './providers';
import ConfigureAmplifyClientSide from './amplify-cognito-config';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pecuniary',
  description: 'Track your finances',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={clsx('font-sans antialiased', fontSans.className)}>
        <Providers>
          {/* <ConfigureAmplifyClientSide /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
