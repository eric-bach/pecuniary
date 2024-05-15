'use client';

import { BuildingIcon, Coins, Home, MoreHorizontal, User } from 'lucide-react';
import SidebarDesktop from './sidebar-desktop';
import { SidebarItems } from '@/types';
import SidebarButton from './sidebar-button';
import useAuthUser from '@/app/hooks/use-auth-user';

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
  const user = useAuthUser();

  if (user && user.isAdmin) {
    const adminLink = {
      label: 'Admin Area',
      href: '/dashboard/admin',
      icon: BuildingIcon,
    };

    // TODO: Hack to prevent duplicate admin links
    if (!sidebarItems.links.some((link) => link.label === adminLink.label)) {
      sidebarItems.links.push(adminLink);
    }
  }

  return <SidebarDesktop sidebarItems={sidebarItems} />;
}
