import { Authenticator, Loader, Theme, ThemeProvider, useAuthenticator } from '@aws-amplify/ui-react';
import { ActionFunction } from '@remix-run/node';

import { createUserSession } from '../utils/session.server';
import { useEffect, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

const theme: Theme = {
  name: 'Theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          '10': '#1976d2',
          '20': '#1976d2',
          '40': '#1976d2',
          '60': '#1976d2',
          '80': '#1976d2',
          '90': '#1976d2',
          '100': '#1976d2',
        },
      },
    },
  },
};

const formFields = {
  signUp: {
    given_name: {
      label: 'First Name:',
      placeholder: 'Enter your first name',
      order: 1,
    },
    family_name: {
      label: 'Last Name:',
      placeholder: 'Enter your last name',
      order: 2,
    },
    phone_number: {
      order: 3,
    },
    username: {
      label: 'Email:',
      placeholder: 'Enter your email',
      order: 4,
    },
    password: {
      order: 5,
    },
    confirm_password: {
      order: 6,
    },
  },
};

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

export function Login() {
  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);

  // listening for when i have a user object...
  useEffect(() => {
    setUserSessionInfo(user);
  }, [user]);

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

  return (
    <ThemeProvider theme={theme}>
      <Authenticator signUpAttributes={['family_name', 'phone_number']} formFields={formFields}>
        {({ signOut, user }) => <Loader />}
      </Authenticator>
    </ThemeProvider>
  );
}

export default Login;
