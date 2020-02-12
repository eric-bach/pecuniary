import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator } from "aws-amplify-react";

import NavBar from "../Nav/NavBar";
import Home from "../Home/Home";
import Accounts from "../Accounts/AccountsList";

function ProtectedApp() {
  return (
    <>
      <NavBar />
      <Container className='main'>
        <Route exact path='/home' component={Home} />
        <Route exact path='/accounts' component={Accounts} />
        {/* <Route
                exact
                path='/transactions/new'
                component={TransactionAdd}
              /> */}
      </Container>
    </>
  );
}

export default withAuthenticator(ProtectedApp, { includeGreetings: false });
