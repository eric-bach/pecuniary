import Layout from '@/components/layout/layout';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/providers/query-client';
import { SheetProvider } from '@/providers/sheet-provider';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <main className='flex flex-1 overflow-y-auto space-y-4 p-4 pt-20'>
        <SheetProvider />
        <Providers>{children}</Providers>
        <Toaster />
      </main>
    </Layout>
  );
};

export default MainLayout;
