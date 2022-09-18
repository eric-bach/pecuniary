import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

import AuthProvider from './contexts/authContext';
import { AuthStatus } from './components/AuthApp';

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

  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.SignedOut);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [isCreated, setCreated] = useState<boolean>(false);

  useEffect(() => {
    if (authStatus === AuthStatus.SignedIn) {
      history.push('/home');
    }

    if (isCreated) {
      history.push('/auth/signin');
    }
  }, [authStatus, isCreated]);

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
                    onSignIn={(status: AuthStatus) => {
                      setDisplayError(status !== AuthStatus.SignedIn);
                      setAuthStatus(status);
                    }}
                    onSignUp={(status: AuthStatus) => {
                      setCreated(status === AuthStatus.VerificationRequired);
                    }}
                  />
                </Route>
                <Route path='/home'>
                  {authStatus !== AuthStatus.SignedIn && <Redirect to='/' />}
                  <DashboardLazy />
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
