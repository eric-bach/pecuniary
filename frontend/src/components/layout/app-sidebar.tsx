import { Link, useLocation } from '@tanstack/react-router';
import { Home, BookA, ChevronUp, User2, ArrowRightLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    exact: false,
  },
  {
    title: 'Accounts',
    url: '/accounts',
    icon: BookA,
    exact: false,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: ArrowRightLeft,
    exact: false,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);

  return (
    <Sidebar className='top-14 border-r !h-[calc(100svh-3.5rem)]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.exact ? location.pathname === item.url : location.pathname.startsWith(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                    <AvatarFallback className='rounded-lg'>
                      <User2 className='h-4 w-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-xs leading-tight'>
                    <span className='truncate'>{user?.signInDetails?.loginId}</span>
                  </div>
                  <ChevronUp className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} />
                      <AvatarFallback className='rounded-lg'>
                        <User2 className='h-4 w-4' />
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-xs leading-tight'>
                      <span className='truncate'>{user?.signInDetails?.loginId}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className='text-[#0067c0] focus:text-[#005bb5] focus:bg-blue-50 cursor-pointer'>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
