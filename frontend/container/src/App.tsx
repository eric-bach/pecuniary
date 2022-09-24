import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn, AuthStatus, IAuth } from './contexts/authContext';
import { ApolloProvider } from '@apollo/client';
import client from './client';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory();

const useStyles = makeStyles((theme) => ({
  '@global': {
    a: {
      textDecoration: 'none',
    },
  },
  error: {
    color: 'white',
    backgroundColor: 'red',
  },
}));

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const App = () => {
  const classes = useStyles();

  // TODO Remove authContext?
  const [auth, setAuth] = useState<IAuth>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Loading);
  const [displayError, setDisplayError] = useState<boolean>(false);

  useEffect(() => {
    if (authStatus === AuthStatus.SignedIn) {
      history.push('/home');
    }

    if (authStatus === AuthStatus.VerificationRequired) {
      history.push('/auth/verify');
    }

    if (authStatus === AuthStatus.Verified) {
      history.push('/auth/signin');
    }
  }, [authStatus]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <AuthProvider>
            <Header
              onSignOut={() => {
                setAuthStatus(AuthStatus.SignedOut);
              }}
            />
            <Suspense fallback={<Progress />}>
              <Switch>
                <Route path='/auth'>
                  {displayError && (
                    <Alert
                      className={classes.error}
                      severity='error'
                      onClose={() => {
                        setDisplayError(false);
                      }}
                    >
                      {authStatus === AuthStatus.SignedOut
                        ? 'Sign in Failed! Email and/or password is incorrect.'
                        : 'Please verify account before signing in.'}
                    </Alert>
                  )}
                  <AuthLazy
                    onSignIn={(status: AuthStatus, authContext: IAuth) => {
                      setAuth(authContext);
                      setDisplayError(status !== AuthStatus.SignedIn);
                      setAuthStatus(status);
                    }}
                    onSignUp={(status: AuthStatus, authContext: IAuth) => {
                      setAuth(authContext);
                      setAuthStatus(status);
                    }}
                    onVerify={(authContext: IAuth) => {
                      setAuth(authContext);
                      setAuthStatus(AuthStatus.Verified);
                    }}
                  />
                </Route>
                <Route path='/home'>
                  <AuthIsSignedIn>
                    <ApolloProvider client={client}>
                      <DashboardLazy client={client} />
                    </ApolloProvider>
                  </AuthIsSignedIn>
                  <AuthIsNotSignedIn>
                    <Redirect to='auth/signin' />
                  </AuthIsNotSignedIn>
                </Route>
                <Route path='/' component={MarketingLazy} />
              </Switch>
            </Suspense>
          </AuthProvider>
        </div>
      </StylesProvider>
    </Router>
  );
};

export default App;
