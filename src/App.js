import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import Home from "./components/Home";
import NewAccount from "./components/NewAccount";
import Transaction from "./components/Transaction";
import Navbar from "./containers/NavBar";

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
            <Route path="/accounts" component={NewAccount} />
            <Route path="/transactions" component={Transaction} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
