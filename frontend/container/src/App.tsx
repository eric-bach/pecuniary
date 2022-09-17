import React, { lazy, Suspense, useState, useEffect, useContext } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import Progress from './components/Progress';
import Header from './components/Header';

import AuthProvider from './contexts/authContext';
import { SignedInStatus } from './components/AuthApp';

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

  useEffect(() => {
    if (isSignedIn) {
      history.push('/home');
    }
  }, [isSignedIn]);

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
                    onSignIn={(signedIn: SignedInStatus) => {
                      setDisplayError(signedIn === SignedInStatus.SignedOut);
                      setIsSignedIn(signedIn === SignedInStatus.SignedIn);
                    }}
                    onSignUp={(user: string, password: string) => {
                      console.log('SIGNING UP: ', user, password);
                      //authContext.signUpWithEmail(user, user, password);
                    }}
                    isSignedIn={isSignedIn}
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
