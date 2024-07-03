'use server';

import { fetchAccounts } from '@/actions';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const accounts = await fetchAccounts();

  return (
    <>
      <Navbar accounts={accounts} />
      <div className='flex flex-col h-screen'>
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar accounts={accounts} />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
