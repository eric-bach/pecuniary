import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className='flex items-center ml-6 mt-6'>{children}</div>;
}
