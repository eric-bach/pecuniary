import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

import ConfigureAmplifyClientSide from './amplify-cognito-config';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pecuniary',
  description: 'Track you finances with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextThemesProvider attribute='class' defaultTheme='light' enableSystem={true} storageKey='dashboard-theme'>
          <ConfigureAmplifyClientSide />
          <NextTopLoader />
          {children}
          <Toaster />
        </NextThemesProvider>
      </body>
    </html>
  );
}
