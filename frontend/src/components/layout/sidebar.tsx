'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BookUser,
  CandlestickChart,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Database,
  Home,
  HousePlus,
  Settings,
  SquareMenu,
  Users,
  Wallet,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';

export interface Item {
  id: string;
  name: string;
}

export default function Sidebar({ accounts }: { accounts: [Account] }) {
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

  let banking = accounts
    .filter((account) => account.category.toLowerCase() === 'banking')
    .map((account) => ({ id: account.accountId, name: account.name }));
  let creditCards = accounts
    .filter((account) => account.category.toLowerCase() === 'credit card')
    .map((account) => ({ id: account.accountId, name: account.name }));
  let investments = accounts
    .filter((account) => account.category.toLowerCase() === 'investment')
    .map((account) => ({ id: account.accountId, name: account.name }));
  let assets = accounts
    .filter((account) => account.category.toLowerCase() === 'asset')
    .map((account) => ({ id: account.accountId, name: account.name }));

  // Toggle the sidebar state
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className='pr-4'>
      <div
        className={cn(
          isSidebarExpanded ? 'w-[300px]' : 'w-[68px]',
          'border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full'
        )}
      >
        <aside className='flex h-full flex-col w-full break-words px-3 overflow-x-hidden columns-1'>
          {/* Top */}
          <div className='mt-20 relative pb-2'>
            <SidebarItem label='Home' icon={<Home size={20} />} path='/dashboard' isSidebarExpanded={isSidebarExpanded} />

            <SidebarMenuItem label='Banking' collapsedLabel='Bank' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItems items={banking} icon={<Wallet size={20} />} rootPath='/accounts' isSidebarExpanded={isSidebarExpanded} />
            {isSidebarExpanded && banking.length < 1 && <div className='text-xs font-light m-2'>No Accounts</div>}

            <SidebarMenuItem label='Credit Cards' collapsedLabel='Cards' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItems
              items={creditCards}
              icon={<CreditCard size={20} />}
              rootPath={`/accounts`}
              isSidebarExpanded={isSidebarExpanded}
            />
            {isSidebarExpanded && creditCards.length < 1 && <div className='text-xs font-light m-2'>No Accounts</div>}

            <SidebarMenuItem label='Investments' collapsedLabel='Invest' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItems
              items={investments}
              icon={<CandlestickChart size={20} />}
              rootPath='/accounts'
              isSidebarExpanded={isSidebarExpanded}
            />
            {isSidebarExpanded && investments.length < 1 && <div className='text-xs font-light m-2'>No Accounts</div>}

            <SidebarMenuItem label='Assets' collapsedLabel='Asset' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItems items={assets} icon={<HousePlus size={20} />} rootPath='/accounts' isSidebarExpanded={isSidebarExpanded} />
            {isSidebarExpanded && assets.length < 1 && <div className='text-xs font-light m-2'>No Accounts</div>}

            <SidebarMenuItem label='Analytics' collapsedLabel='Report' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItem label='Reports' icon={<ClipboardList size={20} />} path='/reports' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItem label='Queries' icon={<Database size={20} />} path='/queries' isSidebarExpanded={isSidebarExpanded} />

            <SidebarMenuItem label='Configuration' collapsedLabel='Config' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItem label='Accounts' icon={<BookUser size={20} />} path='/accounts' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItem label='Payees' icon={<Users size={20} />} path='/payees' isSidebarExpanded={isSidebarExpanded} />
            <SidebarItem label='Categories' icon={<SquareMenu size={20} />} path='/categories' isSidebarExpanded={isSidebarExpanded} />
          </div>

          {/* Bottom */}
          <div className='sticky bottom-0  mt-auto whitespace-nowrap mb-4 transition duration-200 block'>
            <SidebarItem label='Settings' icon={<Settings size={20} />} path={'/settings'} isSidebarExpanded={isSidebarExpanded} />
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

export const SidebarMenuItem: React.FC<{ label: string; collapsedLabel: string; isSidebarExpanded: boolean }> = ({
  label,
  collapsedLabel,
  isSidebarExpanded,
}) => {
  return (
    <>
      {isSidebarExpanded ? (
        <div className='text-xs font-normal pb-1 mt-5'>{label}</div>
      ) : (
        <div className='text-xs font-normal pb-1 mt-5'>{collapsedLabel}</div>
      )}
    </>
  );
};

export const SidebarItems: React.FC<{
  items: Item[];
  icon: any;
  rootPath: string;
  isSidebarExpanded: boolean;
}> = ({ items, icon, rootPath, isSidebarExpanded }) => {
  return (
    <>
      {items.map((i) => {
        return <SidebarItem key={i.id} label={i.name} icon={icon} path={`${rootPath}/${i.id}`} isSidebarExpanded={isSidebarExpanded} />;
      })}
    </>
  );
};

export const SidebarItem: React.FC<{
  label: string;
  icon: any;
  path: string;
  isSidebarExpanded: boolean;
}> = ({ label, icon, path, isSidebarExpanded }) => {
  const pathname = usePathname();
  const active = pathname === path;

  return (
    <>
      {isSidebarExpanded ? (
        <div className='flex flex-col space-y-1'>
          <div className='space-y-1'>
            <Link
              href={path}
              className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                active
                  ? 'font-base text-sm bg-accent shadow-sm text-slate-800 dark:bg-slate-800 dark:text-white'
                  : 'hover:bg-accent hover:text-neutral-700 text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <div className='relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100'>
                {icon}
                <span>{label}</span>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className='space-y-1'>
          <TooltipProvider delayDuration={70}>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={path}
                  className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                    active
                      ? 'font-base text-sm  bg-accent text-slate-800 dark:bg-slate-800 dark:text-white'
                      : 'hover:bg-accent hover:text-slate-700 text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
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
        </div>
      )}
    </>
  );
};
