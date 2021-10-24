import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Home from './Home';
import HomePage from './pages/Home/HomePage';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Verify from './pages/Auth/Verify';
import Accounts from './pages/Account/Accounts';
import AccountForm from './pages/Account/AccountForm';
import ProtectedRoute from './components/ProtectedRoute';
import { User } from './pages/Auth/User';
import NavBar from './components/Nav/NavBar';
import Subscriptions from './pages/TempSubscriptions/Subscriptions';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <User>
        <NavBar />
        <Route exact path='/subscriptions' component={Subscriptions} />

        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/verify' component={Verify} />
        <Container className='main' style={{ paddingTop: '30px' }}>
          <ProtectedRoute exact path='/home' component={HomePage} />
          <ProtectedRoute exact path='/accounts' component={Accounts} />
          <ProtectedRoute path={['/accounts/new', '/accounts/edit/:id']} component={AccountForm} />
        </Container>
      </User>
    </BrowserRouter>
  );
}

export default App;
