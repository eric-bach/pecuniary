import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Authenticator, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { SidebarProvider } from '@/components/ui/sidebar';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { components, formFields, getPecuniaryTheme } from '@/components/auth/auth-config';

// import '@aws-amplify/ui-react/styles.css';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const { tokens } = useTheme();
  const theme = getPecuniaryTheme(tokens);

  return (
    <ThemeProvider theme={theme}>
      <Authenticator formFields={formFields} components={components}>
        {({ signOut, user }) => (
          <SidebarProvider>
            <AppHeader />

            {/* Main Layout Body - Account for h-14 (3.5rem) header */}
            <div className='flex min-h-screen w-full bg-background pt-14'>
              <AppSidebar />

              <div className='flex flex-col w-full min-w-0'>
                <main className='flex-1 p-4'>
                  <Outlet />
                </main>
              </div>
            </div>
          </SidebarProvider>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
