import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import Home from "./components/Home";
import Accounts from "./components/Account/Accounts";
import TransactionAdd from "./components/TransactionAdd";
import Reset from "./components/Reset";
import SecurityAdd from "./components/Security/SecurityAdd";
import Navbar from "./components/NavBar";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/securities/new" component={SecurityAdd} />
            <Route exact path="/transactions/new" component={TransactionAdd} />
            <Route exact path="/reset" component={Reset} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
