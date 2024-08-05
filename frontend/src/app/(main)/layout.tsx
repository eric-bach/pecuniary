import Layout from '@/components/layout/layout';
import { SheetProvider } from '@/providers/sheet-provider';
import { Toaster } from '@/components/ui/sonner';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <main className='flex flex-1 overflow-y-auto space-y-4 p-4 pt-20'>
        <SheetProvider />
        <Toaster richColors position='bottom-right' />
        {children}
      </main>
    </Layout>
  );
};

export default MainLayout;
