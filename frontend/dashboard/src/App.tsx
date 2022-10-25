import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import AccountsList from './pages/Account/AccountsList';
import AccountForm from './pages/Account/AccountForm';
import Dashboard from './pages/Home/Dashboard';

export default ({ history }: any) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/app/accounts'>
          <AccountsList />
        </Route>
        <Route exact path='/app/accounts/new'>
          <AccountForm />
        </Route>
        <Route path='/' component={Dashboard} />
      </Switch>
    </Router>
  );
};
