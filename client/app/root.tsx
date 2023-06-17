import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useFetcher } from '@remix-run/react';
import { logout } from './utils/session.server';

// AMPLIFY
import { Amplify, Auth } from 'aws-amplify';
import config from './aws-exports';
import styles from '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure({ ...config });

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

/**
 * this action function is called when the user logs
 * out of the application. We call logout on server to
 * clear out the session cookies
 */
export const action = async ({ request }: any) => {
  console.log('in logout action');
  return await logout(request);
};

export default function App() {
  const fetcher = useFetcher();

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='ui container' style={{ marginTop: 40 }}>
        <Authenticator.Provider>
          <nav>
            <ul>
              <li>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
              <li>
                <button
                  className='ui button'
                  type='button'
                  onClick={async () => {
                    // amplify sign out
                    await Auth.signOut({ global: true });

                    // clear out our session cookie...
                    fetcher.submit({}, { method: 'post' });
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          </nav>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Authenticator.Provider>
      </body>
    </html>
  );
}
