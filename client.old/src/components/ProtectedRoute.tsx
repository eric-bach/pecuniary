import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...restOfProps }: any) => {
  var isAuthenticated = false;

  // Check if user is authenticated by looking at Cognito accessToken in localStorage
  var keys = Object.keys(localStorage);
  keys.forEach((k) => {
    if (k.endsWith('.accessToken')) {
      var accessToken = localStorage.getItem(k);

      if (accessToken) {
        var payload = JSON.parse(atob(accessToken.split('.')[1]));

        // Convert to epoch time in ms
        var exp = payload.exp * 1000;
        var now = Date.now();

        isAuthenticated = exp > now;
        console.log(`[PROTECTED ROUTE] isAuthenticated: ${isAuthenticated}`);
      }
    }
  });

  return <Route {...restOfProps} render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)} />;
};

export default ProtectedRoute;
