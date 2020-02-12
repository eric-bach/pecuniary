import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator } from "aws-amplify-react";

import NavBar from "../Nav/NavBar";
import HomePage from "../../HomePage";
import Accounts from "../Accounts/AccountsList";
import ProtectedApp from "./ProtectedApp";

class App extends React.Component {
  render() {
    return (
      <>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/(.+)' render={() => <ProtectedApp />} />
      </>
    );
  }
}

//export default withAuthenticator(App, { includeGreetings: false });
export default App;
