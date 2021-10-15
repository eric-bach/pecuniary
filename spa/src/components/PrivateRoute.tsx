import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({ component: Component, ...restOfProps }: any) {
  var isAuthenticated = localStorage.getItem('isAuthenticated');
  console.log('isAuthenticated: ', isAuthenticated);

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)}
    />
  );
}

export default PrivateRoute;
