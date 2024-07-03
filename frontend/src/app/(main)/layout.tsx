import Navbar from '@/components/layout/navbar';
import SidebarWrapper from '@/components/layout/sidebar-wrapper';
import { Toaster } from '@/components/ui/toaster';
import { SheetProvider } from '@/providers/sheet-provider';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className='flex flex-col h-screen'>
        <div className='flex flex-1 overflow-hidden'>
          <SidebarWrapper />
          <main className='flex flex-1 overflow-y-auto space-y-4 p-4 pt-6 md:p-8'>
            <SheetProvider />
            {children}
            <Toaster />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
