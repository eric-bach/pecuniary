import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';
import Account from './components/Account/Account';
import PrivateRoute from './components/PrivateRoute';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/verify' component={Verify} />
      <PrivateRoute exact path='/account' component={Account} />
    </BrowserRouter>
  );
}

export default App;
