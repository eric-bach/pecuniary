import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Home from './Home';
import HomePage from './components/Home/HomePage';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Verify from './components/Auth/Verify';
import Accounts from './components/Account/Accounts';
import AccountForm from './components/Account/AccountForm';
import ProtectedRoute from './components/ProtectedRoute';
import { User } from './components/Auth/User';
import NavBar from './components/Nav/NavBar';
import Dummy from './components/Temp/Dummy';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <User>
        <NavBar />
        <Route exact path='/dummy' component={Dummy} />
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
