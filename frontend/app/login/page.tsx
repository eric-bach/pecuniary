'use client';

import { Authenticator, Theme, ThemeProvider, View, useTheme, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

const theme: Theme = {
  name: 'Theme',
  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: '#1976d2',
        },
        link: {
          color: '#1976d2',
        },
      },
      tabs: {
        item: {
          color: '#1976d2',
          _hover: {
            borderColor: '#1976d2',
            color: '#1976d2',
          },
          _active: {
            borderColor: '#1976d2',
            color: '#1976d2',
          },
        },
      },
    },
  },
};

const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
    },
  },
  signUp: {
    username: {
      label: 'Email',
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

const Login = () => {
  const searchParams = useSearchParams();

  const origin = searchParams.get('origin');
  if (origin) {
    redirect(origin);
  }

  return <div>LOGIN</div>;
};

//export default withAuthenticator(Login);
function App() {
  return (
    <ThemeProvider theme={theme}>
      <View paddingTop='6em'>
        <Authenticator formFields={formFields} hideSignUp={false}></Authenticator>
      </View>
    </ThemeProvider>
  );
}

export default App;
