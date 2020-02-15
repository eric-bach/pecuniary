import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { Auth } from "aws-amplify";

import SignedInMenu from "../Menus/SignedInMenu";
import SignedOutMenu from "../Menus/SignedOutMenu";

class NavBar extends Component {
  state = { userName: "", authenticated: false };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({
        userName: user.username,
        authenticated: true
      });
    });
  };

  handleSignIn = () => {};

  handleSignOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));

    this.setState({ authenticated: false });
    this.props.history.push("/");
  };

  render() {
    return (
      <>
        <Menu inverted fixed='top'>
          <Container>
            <Menu.Item as={Link} to='/home' header>
              <img src='/favicon-32x32.png' alt='logo' />
              Pecuniary
            </Menu.Item>
            <Menu.Item as={NavLink} to='/accounts' name='Accounts' />
            {this.state.authenticated ? (
              <SignedInMenu
                username={this.state.userName}
                signOut={this.handleSignOut}
              />
            ) : (
              <SignedOutMenu signIn={this.handleSignIn} />
            )}
          </Container>
        </Menu>
        <Menu inverted fixed='bottom'>
          <Container>
            <div style={{ color: "white", paddingTop: "10px" }}>
              &copy; {new Date().getFullYear()} Pecuniary. All Rights Reserved
            </div>
          </Container>
        </Menu>
      </>
    );
  }
}

export default withRouter(NavBar);
