'use client';

import { UserNav } from './user-nav';
import Link from 'next/link';
import { ThemeToggler } from '../theme-toggler';
import { Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMobile } from './sidebar-mobile';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';

export default function Navbar({ accounts }: { accounts: [Account] }) {
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-12 items-center justify-between px-4'>
        <div className='flex items-center'>
          <Link href='/dashboard' className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            <span>Pecuniary</span>
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <SidebarMobile accounts={accounts} />
        </div>
        <div className='flex items-center gap-1 px-3'>
          <Sun className='w-6 h-6' />
          <ThemeToggler />
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
