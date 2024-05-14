import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConfigureAmplifyClientSide from './amplify-cognito-config';
import Providers from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pecuniary',
  description: 'Pecuniary',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <ConfigureAmplifyClientSide />
          {children}
        </Providers>
      </body>
    </html>
  );
}
