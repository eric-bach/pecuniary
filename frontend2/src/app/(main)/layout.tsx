import Layout from '@/components/layout/layout';
import { Toaster } from '@/components/ui/sonner';
import RootProviders from '@/providers/root-providers';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RootProviders>
      <Layout>
        <main className='flex flex-1 overflow-y-auto space-y-4 p-4 pt-20'>
          <Toaster richColors position='bottom-right' />
          {children}
        </main>
      </Layout>
    </RootProviders>
  );
};

export default MainLayout;
