import React from 'react';
import { Sidebar } from './sidebar.styles';
import { Avatar, Tooltip } from '@nextui-org/react';
import { CompaniesDropdown } from './companies-dropdown';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { ProductsIcon } from '../icons/sidebar/products-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { ViewIcon } from '../icons/sidebar/view-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { CollapseItems } from './collapse-items';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { useSidebarContext } from '../layout/layout-context';
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon';
import { usePathname } from 'next/navigation';

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className='h-screen z-[20] sticky top-0'>
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className='flex flex-col justify-between h-full'>
          <div className={Sidebar.Body()}>
            <SidebarItem title='Home' icon={<HomeIcon />} isActive={pathname === '/dashboard'} href='/dashboard' />
            <SidebarMenu title='Main Menu'>
              <CollapseItems icon={<AccountsIcon />} items={['Checking', 'Credit Cards', 'Loans']} title='Banking' />
              <SidebarItem isActive={pathname === '/investments'} title='Investments' icon={<PaymentsIcon />} />
              <SidebarItem isActive={pathname === '/assets'} title='Property & Debt' icon={<CustomersIcon />} />
              <SidebarItem isActive={pathname === '/accounts/manage'} title='Manage' icon={<SettingsIcon />} />
            </SidebarMenu>

            <SidebarMenu title='Analytics'>
              <SidebarItem isActive={pathname === '/reports'} title='Reports' icon={<ReportsIcon />} />
              <SidebarItem isActive={pathname === '/queries'} title='Queries' icon={<ViewIcon />} />
            </SidebarMenu>

            <SidebarMenu title='Configuration'>
              <SidebarItem isActive={pathname === '/products'} title='Categories' icon={<ProductsIcon />} />
              <SidebarItem isActive={pathname === '/products'} title='Payees' icon={<CustomersIcon />} />
              <SidebarItem isActive={pathname === '/changelog'} title='Changelog' icon={<ChangeLogIcon />} />
              <SidebarItem isActive={pathname === '/settings'} title='Settings' icon={<SettingsIcon />} />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={'Settings'} color='primary'>
              <div className='max-w-fit'>
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Adjustments'} color='primary'>
              <div className='max-w-fit'>
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Profile'} color='primary'>
              <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' size='sm' />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
