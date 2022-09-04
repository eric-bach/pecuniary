import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';
import { createBrowserHistory } from 'history';

import Header from './components/Header';
import MarketingApp from './components/MarketingApp';
import FinanceApp from './components/FinanceApp';

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const history = createBrowserHistory();

const App = () => (
  <Router history={history}>
    <StylesProvider generateClassName={generateClassName}>
      <Header />
      <Switch>
        <Route path='/' exact component={MarketingApp} />
        <Route path='/home' component={FinanceApp} />
      </Switch>
    </StylesProvider>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
