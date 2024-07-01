import Navbar from '@/components/layout/navbar';
import SidebarWrapper from '@/components/layout/sidebar-wrapper';
import { SheetProvider } from '@/providers/sheet-provider';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className='flex h-screen overflow-hidden'>
        <SidebarWrapper />
        <main className='flex-1 overflow-hidden pt-16'>
          <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
            <SheetProvider />
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
