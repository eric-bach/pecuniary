import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';
import Accounts from './components/Account/Accounts';
import Status from './components/Home/Status';
import ProtectedRoute from './components/ProtectedRoute';
import { User } from './components/Home/User';
import NavBar from './components/Nav/NavBar';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <User>
        <Route exact path='/' component={Home} />
        <NavBar />
        <Status />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/verify' component={Verify} />
        <ProtectedRoute exact path='/accounts' component={Accounts} />
      </User>
    </BrowserRouter>
  );
}

export default App;
