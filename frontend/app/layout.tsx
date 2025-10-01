import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <NextThemesProvider attribute='class' defaultTheme='light' enableSystem={true} storageKey='dashboard-theme'> */}
        <NextTopLoader />
        {children}
        {/* </NextThemesProvider> */}
      </body>
    </html>
  );
}
