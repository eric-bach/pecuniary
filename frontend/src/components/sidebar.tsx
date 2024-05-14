'use client';

import { Coins, Home, MoreHorizontal, User } from 'lucide-react';
import SidebarDesktop from './sidebar-desktop';
import { SidebarItems } from '@/types';
import SidebarButton from './sidebar-button';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/dashboard', icon: Home }, // icon is a component function so sidebar-desktop has to be a server component
    { label: 'Accounts', href: '/dashboard/accounts', icon: Coins },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ],
  extras: (
    <div className='flex flex-col gap-2'>
      <SidebarButton icon={MoreHorizontal} className='w-full'>
        More
      </SidebarButton>
      <SidebarButton className='w-full justify-center text-white' variant='default'>
        Add Account
      </SidebarButton>
    </div>
  ),
};

export default function Sidebar() {
  return <SidebarDesktop sidebarItems={sidebarItems} />;
}
