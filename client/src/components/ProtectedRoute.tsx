import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...restOfProps }: any) => {
  // TODO Change to check if user is authenticated from session instead of localStorage
  var isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Route
      {...restOfProps}
      render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />)}
    />
  );
};

export default ProtectedRoute;
