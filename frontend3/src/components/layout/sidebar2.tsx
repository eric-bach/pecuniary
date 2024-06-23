'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NavItems } from './sidebar2-config';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SideNav() {
  const navItems = NavItems();

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
          isSidebarExpanded ? 'w-[200px]' : 'w-[68px]',
          'border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full'
        )}
      >
        <aside className='flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1'>
          {/* Top */}
          <div className='mt-4 relative pb-2 '>
            <div className='flex flex-col space-y-1'>
              {navItems.map((item, idx) => {
                if (item.position === 'top') {
                  return (
                    <div key={idx} className='space-y-1'>
                      <SideNavItem
                        label={item.name}
                        icon={item.icon}
                        path={item.href}
                        active={item.active}
                        isSidebarExpanded={isSidebarExpanded}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
          {/* Bottom */}
          <div className='sticky bottom-0  mt-auto whitespace-nowrap mb-4 transition duration-200 block'>
            {navItems.map((item, idx) => {
              if (item.position === 'bottom') {
                return (
                  <div key={idx} className='space-y-1'>
                    <SideNavItem
                      label={item.name}
                      icon={item.icon}
                      path={item.href}
                      active={item.active}
                      isSidebarExpanded={isSidebarExpanded}
                    />
                  </div>
                );
              }
            })}
          </div>
        </aside>
        <div className='mt-[calc(calc(90vh)-40px)] relative'>
          <button
            type='button'
            className='absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export const SideNavItem: React.FC<{
  label: string;
  icon: any;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
}> = ({ label, icon, path, active, isSidebarExpanded }) => {
  return (
    <>
      {isSidebarExpanded ? (
        <Link
          href={path}
          className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
            active
              ? 'font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white'
              : 'hover:bg-neutral-200  hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
          }`}
        >
          <div className='relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100'>
            {icon}
            <span>{label}</span>
          </div>
        </Link>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={path}
                className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                  active
                    ? 'font-base text-sm  bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-white'
                    : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`}
              >
                <div className='relative font-base text-sm p-2 flex flex-row items-center space-x-2 rounded-md duration-100'>{icon}</div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='left' className='px-3 py-1.5 text-xs' sideOffset={10}>
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
