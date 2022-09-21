import React, { lazy, Suspense, useState, useEffect, useContext } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

import AuthProvider, { IAuth } from './contexts/authContext';
import { AuthStatus } from './contexts/authContext';

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

  const [auth, setAuth] = useState<IAuth>();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.SignedOut);
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
              isSignedIn={authStatus === AuthStatus.SignedIn}
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
                    onSignIn={(authContext: IAuth) => {
                      console.log('[CONTAINER] onSignIn AuthContext: ', authContext);
                      setAuth(authContext);

                      setDisplayError(authContext.authStatus !== AuthStatus.SignedIn);
                      setAuthStatus(authContext.authStatus || AuthStatus.SignedOut);
                    }}
                    onSignUp={(authContext: IAuth) => {
                      console.log('[CONTAINER] onSignUp AuthContext: ', authContext);
                      setAuth(authContext);

                      setAuthStatus(AuthStatus.VerificationRequired);
                    }}
                    onVerify={() => {
                      setAuthStatus(AuthStatus.Verified);
                    }}
                  />
                </Route>
                <Route path='/home'>
                  {authStatus !== AuthStatus.SignedIn && <Redirect to='/' />}
                  <DashboardLazy session={auth?.sessionInfo} />
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
