import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { User } from './pages/Auth/User';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/Nav/NavBar';

import Home from './Home';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AccountList from './pages/Account/AccountList';
import AccountForm from './pages/Account/AccountForm';
import AccountDetail from './pages/Account/AccountDetail';
import TransactionForm from './pages/Transaction/TransactionForm';

import 'semantic-ui-css/semantic.min.css';
import TransactionDetail from './pages/Transaction/TransactionDetail';

function App() {
  return (
    <Router>
      <div style={{ overflow: 'auto', paddingBottom: '80px' }}>
        {/* Public site */}
        <Route exact path='/' component={Home} />

        {/* Pecuniary app site */}
        <User>
          <NavBar />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />

          {/* Authenticated sites */}
          <Container className='main' style={{ paddingTop: '30px' }}>
            <ProtectedRoute exact path='/home' component={HomePage} />
            <ProtectedRoute exact path='/accounts' component={AccountList} />
            <ProtectedRoute path={['/accounts/new', '/accounts/edit/:id']} component={AccountForm} />
            <ProtectedRoute path={['/accounts/view/:id']} component={AccountDetail} />
            <ProtectedRoute path='/transactions/new' component={TransactionForm} />
            <ProtectedRoute path='/transactions/view/:id' component={TransactionDetail} />
          </Container>
        </User>
      </div>
    </Router>
  );
}

export default App;
