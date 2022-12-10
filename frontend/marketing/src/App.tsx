import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

import Landing from './components/Landing';
import Pricing from './components/Pricing';
import OldHome from './components/OldHome';

export default ({ history }: any) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/oldhome' component={OldHome} />
        <Route exact path='/pricing' component={Pricing} />
        <Route path='/' component={Landing} />
      </Switch>
    </Router>
  );
};