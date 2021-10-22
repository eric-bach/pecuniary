import React, { useState, useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { UserContext } from './Auth/User';

function ProtectedRoute({ component: Component, ...restOfProps }: any) {
  var isAuthenticated = localStorage.getItem('isAuthenticated');
  console.log('isAuthenticated: ', isAuthenticated);

  const [status, setStatus] = useState('false');
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    getSession().then((session: any) => {
      console.log('Session: ', session);
      setStatus('true');
      console.log('Status: ', status);
    });
  });

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated === 'true' ? <Component {...props} /> : <Redirect to='/login' />)}
    />
  );
}

export default ProtectedRoute;
