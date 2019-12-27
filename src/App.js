import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import Accounts from "./components/Accounts";
import Transaction from "./components/Transaction";
import TransactionAdd from "./components/TransactionAdd";
import Navbar from "./components/NavBar";

class App extends React.Component {
  state = {
    authenticated: false
  };

  componentDidMount = async () => {
    const user = await Auth.currentUserInfo();
    this.setState({ authenticated: user !== null });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/transactions" component={Transaction} />
            <Route exact path="/transactions/new" component={TransactionAdd} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
