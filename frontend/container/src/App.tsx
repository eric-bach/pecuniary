import React, { lazy, Suspense, useState, useEffect, useContext } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
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

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

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
            <Header onSignOut={() => setIsSignedIn(false)} isSignedIn={isSignedIn} />
            <Suspense fallback={<Progress />}>
              <Switch>
                <Route path='/auth'>
                  <AuthLazy
                    onSignIn={(signedIn: SignedInStatus) => {
                      console.log('SIGNED IN: ', signedIn);
                      setIsSignedIn(signedIn === SignedInStatus.SignedIn);
                    }}
                    onSignUp={(user: string, password: string) => {
                      console.log('SIGNING UP: ', user, password);
                      //authContext.signUpWithEmail(user, user, password);
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
