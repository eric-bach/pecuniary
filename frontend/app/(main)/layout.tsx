'use client';

import { Theme, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AuthProvider from '@/components/auth/page';
import RootProviders from '@/providers/root-providers';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { tokens } = useTheme();

  const theme: Theme = {
    name: 'Pecuniary Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
            borderWidth: '0',
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: '#0067c0',
          },
          link: {
            color: '#0067c0',
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px #0067c0`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral['80'],
            _active: {
              borderColor: tokens.colors.neutral['100'],
              color: '#0067c0',
            },
          },
        },
      },
    },
  };

  return (
    <RootProviders>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SidebarProvider>
            <div className='flex h-screen w-full'>
              <AppSidebar />
              <main className='flex-1 overflow-auto w-full'>
                <div className='w-full max-w-none min-h-full py-6 px-6'>{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </RootProviders>
  );
};

export default MainLayout;
