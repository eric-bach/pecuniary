import React from 'react';
import { Router, Switch, Route, BrowserRouter } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';
import { createBrowserHistory } from 'history';

import Header from './components/Header';
import AuthApp from './components/AuthApp';
import MarketingApp from './components/MarketingApp';
import FinanceApp from './components/FinanceApp';

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory();

export default () => (
  <BrowserRouter>
    <StylesProvider generateClassName={generateClassName}>
      <Header />
      <Switch>
        <Route path='/auth' component={AuthApp} />
        <Route path='/home' component={FinanceApp} />
        <Route path='/' exact component={MarketingApp} />
      </Switch>
    </StylesProvider>
  </BrowserRouter>
);
