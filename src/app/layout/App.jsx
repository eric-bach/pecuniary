import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator } from "aws-amplify-react";

import NavBar from "../../components/Nav/NavBar";
import Home from "../../components/Home/Home";
import AccountList from "../../components/Account/AccountList";

class App extends React.Component {
  componentDidMount() {
    console.log("App");
  }

  render() {
    return (
      <>
        <NavBar />
        <Container className='main'>
          <Route exact path='/home' component={Home} />
          <Route exact path='/accounts' component={AccountList} />
          {/* <Route
                exact
                path='/transactions/new'
                component={TransactionAdd}
              /> */}
        </Container>
      </>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
