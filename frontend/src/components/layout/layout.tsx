'use server';

import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className='flex flex-col h-screen'>
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
