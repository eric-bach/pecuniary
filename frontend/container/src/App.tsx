import React, { lazy, Suspense, useState, useEffect, useContext } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
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

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [isCreated, setCreated] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push('/home');
    }

    if (isCreated) {
      history.push('/auth/verify');
    }
  }, [isSignedIn, isCreated]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <AuthProvider>
            <Header onSignOut={() => setIsSignedIn(false)} />
            <Suspense fallback={<Progress />}>
              <Switch>
                <Route path='/auth'>
                  {displayError && (
                    <Alert
                      severity='error'
                      onClose={() => {
                        setDisplayError(false);
                      }}
                    >
                      Sign in Failed! Email and/or password is incorrect.
                    </Alert>
                  )}
                  <AuthLazy
                    onSignIn={(status: AuthStatus) => {
                      setDisplayError(status === AuthStatus.SignedOut);
                      setIsSignedIn(status === AuthStatus.SignedIn);
                    }}
                    onSignUp={(status: AuthStatus) => {
                      setCreated(status === AuthStatus.VerificationRequired);
                    }}
                  />
                </Route>
                <Route path='/home'>
                  {!isSignedIn && <Redirect to='/' />}
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
