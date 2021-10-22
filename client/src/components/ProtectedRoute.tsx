import { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { UserContext } from './Auth/User';

function ProtectedRoute({ component: Component, ...restOfProps }: any) {
  // TODO Get rid of localStorage implementation
  var isAuthenticated = localStorage.getItem('isAuthenticated');

  const { getSession } = useContext(UserContext);

  useEffect(() => {
    getSession().then((session: any) => {
      console.log('[PROTECTEDROUTE] Session: ', session);
    });
  });

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)}
    />
  );
}

export default ProtectedRoute;
