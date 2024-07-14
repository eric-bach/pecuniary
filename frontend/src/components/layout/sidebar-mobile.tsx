'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Account } from '../../../../backend/src/appsync/api/codegen/appsync';
import SidebarNavItems from './sidebar-nav-items';

export interface Item {
  id: string;
  name: string;
}

interface SidebarMobileProps extends React.HTMLAttributes<HTMLDivElement> {
  accounts: [Account];
}

export function SidebarMobile({ accounts }: SidebarMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side='left' className='!px-0'>
          <div className='space-y-4 py-4'>
            <div className='px-3 py-2'>
              <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>Overview</h2>
              <div className='space-y-1'>
                <SidebarNavItems accounts={accounts} isSidebarExpanded={true} isMobileNav={true} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
