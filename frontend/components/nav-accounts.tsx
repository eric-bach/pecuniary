'use client';

import { ChevronRight, type LucideIcon, CandlestickChart, CreditCard, HousePlug, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Account } from '@/types/generated';

interface AccountCategory {
  title: string;
  icon: LucideIcon;
  category: string;
  isActive?: boolean;
}

const accountCategories: AccountCategory[] = [
  {
    title: 'Banking',
    icon: Wallet,
    category: 'banking',
    isActive: true,
  },
  {
    title: 'Credit Cards',
    icon: CreditCard,
    category: 'credit card',
    isActive: true,
  },
  {
    title: 'Investments',
    icon: CandlestickChart,
    category: 'investment',
    isActive: true,
  },
  {
    title: 'Assets',
    icon: HousePlug,
    category: 'asset',
    isActive: true,
  },
];

export function NavAccounts() {
  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number') return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDisplayValue = (account: Account) => {
    const category = account.category.toLowerCase();
    if (category === 'banking' || category === 'credit card') {
      return formatCurrency(account.balance);
    } else if (category === 'investment' || category === 'asset') {
      return formatCurrency(account.marketValue);
    }
    return '';
  };

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      // Handle the new API response format
      return data.accounts || data; // Fallback for backward compatibility
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  if (accountsQuery.isFetching) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Accounts</SidebarGroupLabel>
        <SidebarMenu>
          {accountCategories.map((category) => (
            <SidebarMenuItem key={category.title}>
              <SidebarMenuButton>
                <category.icon />
                <span>{category.title}</span>
                <Skeleton className='ml-auto h-4 w-4' />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  const accounts = accountsQuery.data as Account[];

  // Group accounts by category
  const groupedAccounts = accountCategories.map((category) => {
    const categoryAccounts =
      accounts
        ?.filter((account) => account.category.toLowerCase() === category.category)
        .map((account) => ({
          title: account.name,
          url: `/accounts/${account.accountId}`,
          displayValue: getDisplayValue(account),
        })) || [];

    return {
      ...category,
      items: categoryAccounts,
    };
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Accounts</SidebarGroupLabel>
      <SidebarMenu>
        {groupedAccounts.map((category) => (
          <Collapsible key={category.title} asChild defaultOpen={category.isActive} className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={category.title}>
                  <category.icon />
                  <span>
                    {category.title} ({category.items.length})
                  </span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {category.items.length > 0 ? (
                    category.items.map((account) => (
                      <SidebarMenuSubItem key={account.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={account.url} className='flex justify-between items-center w-full'>
                            <span>{account.title}</span>
                            {account.displayValue && (
                              <span className='text-xs text-muted-foreground ml-2 tabular-nums'>{account.displayValue}</span>
                            )}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <span className='text-muted-foreground text-xs opacity-60 cursor-default'>No accounts</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
