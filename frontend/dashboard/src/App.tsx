import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Accounts from './pages/Account/Accounts';
import AccountList from './pages/Account/AccountList';
import Home from './pages/Home/Home';

export default ({ history, client }: any) => {
  console.log('asdasd ', client);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/app/accounts'>
          <Accounts client={client} />
        </Route>
        <Route exact path='/app/accountslist'>
          <AccountList client={client} />
        </Route>
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  );
};
