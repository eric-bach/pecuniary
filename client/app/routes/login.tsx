import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { ActionFunction } from '@remix-run/node';

import { createUserSession } from '../utils/session.server';
import { useEffect, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

/**
 *
 * @param param0
 * @returns
 */
export const action: ActionFunction = async ({ request }) => {
  // get data from the form
  let formData = await request.formData();
  let accessToken = formData.get('accessToken');
  let idToken = formData.get('idToken');

  // create the user session
  return await createUserSession({
    request,
    userInfo: {
      accessToken,
      idToken,
    },
    redirectTo: '/dashboard',
  });
};

/**
 * check for authenticated user, if not redirect to
 * login
 *
 * @param {*} param0
 * @returns
 */

export function Login() {
  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);

  // listening for when i have a user object...
  useEffect(() => {
    console.log(user);
    setUserSessionInfo(user);
  }, [user]);

  /**
   *
   */
  const setUserSessionInfo = useCallback(
    (user: any) => {
      // if i have a user then submit the tokens to the
      // action function to set up the cookies for server
      // authentication
      if (user && fetcher.type === 'init') {
        fetcher.submit(
          {
            accessToken: user?.signInUserSession?.accessToken?.jwtToken,
            idToken: user?.signInUserSession?.idToken?.jwtToken,
          },
          { method: 'post' }
        );
      }
    },
    [user]
  );

  return <Authenticator>{({ signOut, user }) => <h1>LOADING...</h1>}</Authenticator>;
}

export default Login;
