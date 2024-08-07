'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Account } from '../../../../backend/src/appsync/api/codegen/appsync';
import SidebarNavItems from './sidebar-nav-items';

interface SidebarProps {
  accounts: [Account];
  isMobileNav?: boolean;
}

export default function Sidebar({ accounts }: SidebarProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    // Get the sidebar state from localStorage
    const saved = window.localStorage.getItem('sidebarExpanded');
    if (saved === null) {
      return true;
    }
    const initialValue = JSON.parse(saved);
    return initialValue;
  });

  // Save the sidebar state in localStorage
  useEffect(() => {
    window.localStorage.setItem('sidebarExpanded', JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);

  // Toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className='pr-4'>
      <div
        className={cn(
          isSidebarExpanded ? 'w-[300px]' : 'w-[68px]',
          'border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full pt-20 relative pb-2'
        )}
      >
        <SidebarNavItems accounts={accounts} isMobileNav={false} isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}
