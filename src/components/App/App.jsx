import React from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { withAuthenticator, AmplifyTheme } from "aws-amplify-react";

import ScrollToTop from "../../common/ScrollToTop";
import NavBar from "../Nav/NavBar";
import Home from "../Home/Home";
import AccountList from "../Account/AccountList";
import AccountForm from "../Account/AccountForm";
import AccountDetail from "../Account/AccountDetail";
import TransactionForm from "../Transaction/TransactionForm";
import Processing from "../Account/Processing";

class App extends React.Component {
  render() {
    return (
      <>
        <ScrollToTop>
          <NavBar />
          <Container className='main'>
            <Route exact path='/home' component={Home} />
            <Route exact path='/accounts' component={AccountList} />
            <Route path='/accounts/view/:id' component={AccountDetail} />
            <Route path={["/accounts/new", "/accounts/edit/:id"]} component={AccountForm} />
            <Route path='/transactions/new' component={TransactionForm} />
            <Route path='/processing' component={Processing} />
          </Container>
        </ScrollToTop>
      </>
    );
  }
}

const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    color: "fff",
    backgroundColor: "#2185d0"
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundImage: "linear-gradient(135deg, rgb(24, 42, 115) 0%, rgb(33, 138, 174) 69%, rgb(32, 167, 172) 89%)"
  }
};

export default withAuthenticator(App, false, [], null, theme);
