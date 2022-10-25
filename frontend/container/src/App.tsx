import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn, AuthStatus, IAuth } from './contexts/authContext';
import client from './client';

const MarketingLazy = lazy(() => import('./components/MarketingApp'));
const AuthLazy = lazy(() => import('./components/AuthApp'));
const DashboardLazy = lazy(() => import('./components/DashboardApp'));

const history = createBrowserHistory();

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const App = () => {
  // TODO Remove authContext?
  const [auth, setAuth] = useState<IAuth>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Loading);
  const [displayError, setDisplayError] = useState<boolean>(false);

  useEffect(() => {
    if (authStatus === AuthStatus.SignedIn) {
      history.push('/app');
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
                    sx={{
                      color: 'white',
                      backgroundColor: 'red',
                    }}
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
              <Route path='/app'>
                <AuthIsSignedIn>
                  <DashboardLazy client={client} />
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
    </Router>
  );
};

export default App;
