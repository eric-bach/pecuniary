import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator } from "aws-amplify-react";

import NavBar from "../Nav/NavBar";
import Home from "../Home/Home";
import AccountList from "../Account/AccountList";
import AccountDetail from "../Account/AccountDetail";

class App extends React.Component {
  render() {
    return (
      <>
        <NavBar />
        <Container className='main'>
          <Route exact path='/home' component={Home} />
          <Route exact path='/accounts' component={AccountList} />
          <Route path='/accounts/:id' component={AccountDetail} />
        </Container>
      </>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
