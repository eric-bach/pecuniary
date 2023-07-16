import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Container } from '@mui/material';
import { logout } from './utils/session.server';

// AMPLIFY
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';

import Header from './components/header';

import styles from '@aws-amplify/ui-react/styles.css';

Amplify.configure({ ...config });

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [
        { rel: 'stylesheet', href: cssBundleHref },
        { rel: 'stylesheet', href: styles },
      ]
    : [{ rel: 'stylesheet', href: styles }]),
];

/**
 * this action function is called when the user logs
 * out of the application. We call logout on server to
 * clear out the session cookies
 */
export const action = async ({ request }: any) => {
  return await logout(request);
};

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='icon' href='/_static/favicon.ico' />
        <Meta />
        <Links />
      </head>
      <body className='ui container' style={{ margin: 0 }}>
        <Authenticator.Provider>
          <Header />
          <Container maxWidth='xl' sx={{ paddingTop: 2 }}>
            <Outlet />
            <ScrollRestoration />
          </Container>
          <Scripts />
          <LiveReload />
        </Authenticator.Provider>
      </body>
    </html>
  );
}
