import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './components/Home/Signup';
import Login from './components/Home/Login';
import Verify from './components/Home/Verify';
import Account from './components/Account/Account';
import Status from './components/Home/Status';
import ProtectedRoute from './components/ProtectedRoute';
import { User } from './components/Home/User';

import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <User>
        <Route exact path='/' component={Home} />
        <Status />
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/verify' component={Verify} />
        <ProtectedRoute exact path='/account' component={Account} />
      </User>
    </BrowserRouter>
  );
}

export default App;
