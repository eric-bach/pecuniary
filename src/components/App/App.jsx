import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator } from "aws-amplify-react";

import ScrollToTop from "../../common/ScrollToTop";
import NavBar from "../Nav/NavBar";
import Home from "../Home/Home";
import AccountList from "../Account/AccountList";
import AccountForm from "../Account/AccountForm";

class App extends React.Component {
  render() {
    return (
      <>
        <ScrollToTop>
          <NavBar />
          <Container className='main'>
            <Route exact path='/home' component={Home} />
            <Route exact path='/accounts' component={AccountList} />
            <Route path={["/createAccount", "/accounts/:id"]} component={AccountForm} />
          </Container>
        </ScrollToTop>
      </>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
