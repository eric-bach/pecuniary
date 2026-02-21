// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { Outlet, HeadContent, Scripts } from '@tanstack/react-router';
import { Amplify } from 'aws-amplify';
import { config } from '../amplify-config';
import appCss from '../index.css?url';

Amplify.configure(config);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pecuniary',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
