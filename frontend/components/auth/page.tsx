'use client';

import { Authenticator, Button, Heading, Image, useAuthenticator, useTheme, View } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from '@aws-amplify/core';
import '@aws-amplify/ui-react/styles.css';

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    },
  },
};

Amplify.configure(config, { ssr: true });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View textAlign='center' padding={tokens.space.large} paddingTop='6rem'>
          <Image alt='Pecuniary' src='logo.jpg' width={54} />
          <Heading level={4}>Pecuniary</Heading>
        </View>
      );
    },

    SignIn: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={4}>
            Sign in to your account
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();

        return (
          <View textAlign='center'>
            <Button fontWeight='normal' onClick={toForgotPassword} size='small' variation='link'>
              Reset Password
            </Button>
          </View>
        );
      },
    },

    SignUp: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={4}>
            Create a new account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();

        return (
          <View textAlign='center'>
            <Button fontWeight='normal' onClick={toSignIn} size='small' variation='link'>
              Back to Sign In
            </Button>
          </View>
        );
      },
    },
  };

  const formFields = {
    signUp: {
      username: {
        label: 'Email:',
        placeholder: 'Enter your email',
        order: 1,
      },
      password: {
        order: 2,
      },
      confirm_password: {
        order: 3,
      },
    },
  };

  return (
    <Authenticator formFields={formFields} components={components}>
      {({ signOut, user }) => (
        <>
          {/* <h1>Hello {user?.signInDetails?.loginId}</h1>
        <button className='primary' onClick={signOut}>
          Sign out
        </button> */}
          {children}
        </>
      )}
    </Authenticator>
  );
};

export default AuthProvider;
