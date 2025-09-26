'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookUser,
  CandlestickChart,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  HousePlug,
  LineChart,
  SquareMenu,
  Users,
  Wallet,
} from 'lucide-react';

import { NavAccounts } from '@/components/nav-accounts';
import { NavConfiguration } from '@/components/nav-configuration';
import { NavUser } from '@/components/nav-user';
import { PecuniaryLogo } from '@/components/pecuniary-logo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  accounts: [
    {
      title: 'Banking',
      url: '#',
      icon: Wallet,
      isActive: true,
      items: [
        {
          title: 'Account 1',
          url: '#',
        },
        {
          title: 'Account 2',
          url: '#',
        },
        {
          title: 'Account 3',
          url: '#',
        },
      ],
    },
    {
      title: 'Credit Cards',
      url: '#',
      icon: CreditCard,
      items: [],
    },
    {
      title: 'Investments',
      url: '#',
      icon: CandlestickChart,
      items: [],
    },
    {
      title: 'Assets',
      url: '#',
      icon: HousePlug,
      items: [],
    },
  ],
  configuration: [
    {
      name: 'Accounts',
      url: '#',
      icon: BookUser,
    },
    {
      name: 'Payees',
      url: '#',
      icon: Users,
    },
    {
      name: 'Categories',
      url: '#',
      icon: SquareMenu,
    },
    {
      name: 'Symbols',
      url: '#',
      icon: LineChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <PecuniaryLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavAccounts items={data.accounts} />
        <NavConfiguration projects={data.configuration} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
