import React from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Home from './components/Home/Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';

function App() {
  return (
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route exact path='/home'>
        <Home />
      </Route>
      <Route exact path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/login'>
        <Login />
      </Route>
      <Route exact path='/verify'>
        <Verify />
      </Route>
    </Switch>
  );
}

export default App;
