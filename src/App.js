import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import Accounts from "./components/Accounts";
import TransactionAdd from "./components/TransactionAdd";
import Navbar from "./components/NavBar";

class App extends React.Component {
  componentDidMount = async () => {
    // Seed lookup tables here?
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/transactions/new" component={TransactionAdd} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
