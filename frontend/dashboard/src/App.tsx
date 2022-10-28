import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import AccountsList from './pages/Account/AccountsList';
import Account from './pages/Account/Account';
import Dashboard from './pages/Home/Dashboard';

export default ({ history }: any) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/app/accounts' component={AccountsList} />
        <Route exact path={['/app/accounts/new', '/app/accounts/:id']} component={Account} />
        <Route path='/' component={Dashboard} />
      </Switch>
    </Router>
  );
};
