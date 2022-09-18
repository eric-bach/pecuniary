import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

import SignIn from './components/Signin';
import SignUp from './components/Signup';
import Verify from './components/Verify';

const generateClassName = createGenerateClassName({
  productionPrefix: 'au',
});

export default ({ onSignIn, onSignUp, history }: any) => {
  return (
    <div>
      <StylesProvider generateClassName={generateClassName}>
        <Router history={history}>
          <Switch>
            <Route path='/auth/signin'>
              <SignIn onSignIn={(user: string, password: string) => onSignIn(user, password)} />
            </Route>
            <Route path='/auth/signup'>
              <SignUp onSignUp={(user: string, password: string) => onSignUp(user, password)} created={created} />
            </Route>
            <Route path='/auth/verify'>
              <Verify />
            </Route>
          </Switch>
        </Router>
      </StylesProvider>
    </div>
  );
};
