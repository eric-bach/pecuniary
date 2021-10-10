import React from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <Switch>
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
    </Switch>
  );
}

export default App;
