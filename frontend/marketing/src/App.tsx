import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

import Landing from './Landing';
import OldHome from './OldHome';

const generateClassName = createGenerateClassName({
  productionPrefix: 'ma',
});

export default () => (
  <StylesProvider generateClassName={generateClassName}>
    <BrowserRouter>
      <Switch>
        <Route exact path='/old' component={OldHome} />
        <Route path='/' component={Landing} />
      </Switch>
    </BrowserRouter>
  </StylesProvider>
);
