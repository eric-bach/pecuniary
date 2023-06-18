import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { Container } from '@mui/material';

// AMPLIFY
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';

import styles from '@aws-amplify/ui-react/styles.css';

import Header from './header';

Amplify.configure({ ...config });

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function App() {
  return (
    <html lang='en'>
      <head>
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
