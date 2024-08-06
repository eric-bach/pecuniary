'use client';

import { cn } from '@/lib/utils';
import SidebarNavItems from './sidebar-nav-items';
import { useSidebarExpanded } from '@/hooks/use-sidebar-expanded';

export default function Sidebar() {
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebarExpanded();

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
        <SidebarNavItems isMobileNav={false} isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}
