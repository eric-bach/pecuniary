import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import Accounts from "./components/Account/Accounts";
import TransactionAdd from "./components/TransactionAdd";
import Reset from "./components/Reset";
import Navbar from "./components/NavBar";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/transactions/new" component={TransactionAdd} />
            <Route exact path="/reset" component={Reset} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
