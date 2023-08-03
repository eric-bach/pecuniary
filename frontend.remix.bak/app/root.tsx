import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { LinksFunction } from '@remix-run/node';
import { Container } from '@mui/material';
import { logout } from './utils/session.server';

// AMPLIFY
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';

import styles from '@aws-amplify/ui-react/styles.css';
import footerStyles from '~/styles/footer.css';

import Header from './components/header';
import Footer from './components/footer';

Amplify.configure({ ...config });

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: footerStyles },
  ];
};

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
          <Footer />
        </Authenticator.Provider>
      </body>
    </html>
  );
}
