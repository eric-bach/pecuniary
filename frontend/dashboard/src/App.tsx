import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import AccountsList from './pages/Account/AccountsList';
import AccountForm from './pages/Account/AccountForm';
import AccountDetail from './pages/Account/AccountDetail';
import Dashboard from './pages/Home/Dashboard';

export default ({ history }: any) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/app/accounts' component={AccountsList} />
        <Route exact path='/app/accounts/new' component={AccountForm} />
        <Route exact path='/app/accounts/view/:id' component={AccountDetail} />
        <Route path='/' component={Dashboard} />
      </Switch>
    </Router>
  );
};
