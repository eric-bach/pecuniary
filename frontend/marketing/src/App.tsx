import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

import Landing from './Landing';
import OldHome from './OldHome';

const generateClassName = createGenerateClassName({
  productionPrefix: 'ma',
});

export default ({ history }: any) => (
  <StylesProvider generateClassName={generateClassName}>
    <Router history={history}>
      <Switch>
        <Route exact path='/temp' component={OldHome} />
        <Route path='/' component={OldHome} />
      </Switch>
    </Router>
  </StylesProvider>
);
