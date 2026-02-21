import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, Settings } from 'lucide-react';

export function AppHeader() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b bg-background shadow-sm'>
      {/* Left container aligned to sidebar width (14rem/w-56) */}
      <div className='flex items-center justify-between w-[14rem] shrink-0 px-3.5'>
        <div className='flex items-center gap-4'>
          <img src='/logo.png' alt='Pecuniary Logo' className='w-6 h-6 object-contain' />
          <Search className='w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer' />
          <div className='relative'>
            <Bell className='w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer' />
            <span className='absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full' />
          </div>
          <Settings className='w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer' />
        </div>
        <SidebarTrigger className='-mr-2 text-gray-500 hover:text-gray-900' />
      </div>

      {/* Portals Target Container */}
      <div className='flex flex-1 items-center justify-between pl-4 pr-4'>
        <div id='navbar-page-title' className='font-semibold text-lg flex items-center'></div>
        <div id='navbar-page-actions' className='flex items-center gap-2'></div>
      </div>
    </header>
  );
}
