'use client';

import * as React from 'react';
import { BookUser, LineChart, SquareMenu, Users } from 'lucide-react';

import { NavAccounts } from '@/components/nav-accounts';
import { NavConfiguration } from '@/components/nav-configuration';
import { NavUser } from '@/components/nav-user';
import { PecuniaryLogo } from '@/components/pecuniary-logo';
import { ResizableSidebar } from '@/components/resizable-sidebar';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

// Configuration data
const configurationData = [
  {
    name: 'Accounts',
    url: '/accounts',
    icon: BookUser,
  },
  {
    name: 'Payees',
    url: '/payees',
    icon: Users,
  },
  {
    name: 'Categories',
    url: '/categories',
    icon: SquareMenu,
  },
  {
    name: 'Symbols',
    url: '/symbols',
    icon: LineChart,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <ResizableSidebar defaultWidth={280} minWidth={240} maxWidth={480} className='h-screen'>
      <Sidebar collapsible='none' className='w-full border-none' {...props}>
        <SidebarHeader>
          <PecuniaryLogo />
        </SidebarHeader>
        <SidebarContent>
          <NavAccounts />
          <NavConfiguration projects={configurationData} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </ResizableSidebar>
  );
}
