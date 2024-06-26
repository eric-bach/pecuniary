import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden pt-16'>
          <div className='flex-1 space-y-4  p-4 pt-6 md:p-8'>{children}</div>
        </main>
      </div>
    </>
  );
};

export default MainLayout;
