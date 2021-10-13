import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';
import Account from './components/Home/Account/Account';
import PrivateRoute from './components/Home/PrivateRoute/PrivateRoute';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/login'>
        <Login />
      </Route>
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/verify'>
        <Verify />
      </Route>
      <PrivateRoute exact path='/account' component={Account} />
    </BrowserRouter>
  );
}

export default App;
