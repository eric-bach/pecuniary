'use client';

import React, { useEffect } from 'react';
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
import { CollapseItems, Item } from './collapse-items';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { FilterIcon } from '../icons/sidebar/filter-icon';
import { useSidebarContext } from '../layout/layout-context';
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon';
import { usePathname } from 'next/navigation';
import { fetchAccounts } from '../../actions/index';
import { CreditCardIcon } from '../icons/sidebar/credit-card-icon';

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  const [banking, setBanking] = React.useState<Item[]>([]);
  const [creditCards, setCreditCards] = React.useState<Item[]>([]);
  const [investments, setInvestments] = React.useState<Item[]>([]);
  const [assets, setAssets] = React.useState<Item[]>([]);

  useEffect(() => {
    async function fetchData() {
      const accounts = await fetchAccounts();

      setBanking(
        accounts
          .filter((account) => account.category.toLowerCase() === 'banking')
          .map((account) => ({ id: account.accountId, name: account.name }))
      );
      setCreditCards(
        accounts
          .filter((account) => account.category.toLowerCase() === 'credit card')
          .map((account) => ({ id: account.accountId, name: account.name }))
      );
      setInvestments(
        accounts
          .filter((account) => account.category.toLowerCase() === 'investment')
          .map((account) => ({ id: account.accountId, name: account.name }))
      );
      setAssets(
        accounts
          .filter((account) => account.category.toLowerCase() === 'asset')
          .map((account) => ({ id: account.accountId, name: account.name }))
      );
    }

    fetchData();
  }, []);

  return (
    <aside className='h-screen z-[20] sticky top-0'>
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div className={Sidebar({ collapsed: collapsed })}>
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className='flex flex-col justify-between h-full'>
          <div className={Sidebar.Body()}>
            <SidebarItem title='Home' icon={<HomeIcon />} isActive={pathname === '/dashboard'} href='/dashboard' />
            <SidebarMenu title='Accounts'>
              {banking.length > 0 ? (
                <CollapseItems icon={<AccountsIcon />} items={banking} title='Banking' />
              ) : (
                <SidebarItem title='Banking' icon={<AccountsIcon />} />
              )}
              {creditCards.length > 0 ? (
                <CollapseItems icon={<CreditCardIcon />} items={creditCards} title='Credit Cards' />
              ) : (
                <SidebarItem title='Credit Cards' icon={<CreditCardIcon />} />
              )}
              {investments.length > 0 ? (
                <CollapseItems icon={<PaymentsIcon />} items={investments} title='Investments' />
              ) : (
                <SidebarItem title='Investments' icon={<PaymentsIcon />} />
              )}
              {assets.length > 0 ? (
                <CollapseItems icon={<CustomersIcon />} items={assets} title='Property & Debt' />
              ) : (
                <SidebarItem title='Property & Debt' icon={<CustomersIcon />} />
              )}
              <SidebarItem isActive={pathname === '/accounts/manage'} title='Manage' icon={<SettingsIcon />} href='/accounts/manage' />
            </SidebarMenu>

            <SidebarMenu title='Analytics'>
              <SidebarItem isActive={pathname === '/reports'} title='Reports' icon={<ReportsIcon />} />
              <SidebarItem isActive={pathname === '/queries'} title='Queries' icon={<ViewIcon />} />
            </SidebarMenu>

            <SidebarMenu title='Configuration'>
              <SidebarItem isActive={pathname === '/products'} title='Categories' icon={<ProductsIcon />} />
              <SidebarItem isActive={pathname === '/contacts'} title='Payees' href='/contacts' icon={<CustomersIcon />} />
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
