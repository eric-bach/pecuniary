import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import Accounts from "./components/Accounts";
import Transaction from "./components/Transaction";
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
            <Route path="/accounts" component={Accounts} />
            <Route path="/transactions" component={Transaction} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
