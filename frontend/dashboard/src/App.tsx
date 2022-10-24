import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import AccountsList from './pages/Account/AccountsList';
import Dashboard from './pages/Home/Dashboard';

export default ({ history, client }: any) => {
  console.log('asdasd ', client);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/app/accounts'>
          <AccountsList client={client} />
        </Route>
        <Route path='/' component={Dashboard} />
      </Switch>
    </Router>
  );
};
