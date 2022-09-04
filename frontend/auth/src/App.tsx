import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

const generateClassName = createGenerateClassName({
  productionPrefix: 'au',
});

import Signin from './components/Signin';
import Signup from './components/Signup';

export default ({ history }: any) => (
  <StylesProvider generateClassName={generateClassName}>
    <Router history={history}>
      <Switch>
        <Route path='/auth/signin' component={Signin} />
        <Route path='/auth/signup' component={Signup} />
      </Switch>
    </Router>
  </StylesProvider>
);
