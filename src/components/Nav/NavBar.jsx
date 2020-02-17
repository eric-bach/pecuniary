import React, { Component } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Menu } from "semantic-ui-react";

import SignedInMenu from "./Menus/SignedInMenu";
import SignedOutMenu from "./Menus/SignedOutMenu";
import { signIn, signOut } from "../Auth/authActions";

class NavBar extends Component {
  componentDidMount = () => {
    console.log("NavBar");

    this.handleSignIn();
  };

  handleSignIn = () => {
    this.props.signIn();
  };

  handleSignOut = () => {
    this.props.signOut();

    this.props.history.push("/");
  };

  render() {
    const { userName, authenticated } = this.props;

    return (
      <>
        <Menu inverted fixed='top'>
          <Container>
            <Menu.Item as={Link} to='/home' header>
              <img src='/favicon-32x32.png' alt='logo' />
              Pecuniary
            </Menu.Item>
            <Menu.Item as={NavLink} to='/accounts' name='Accounts' />
            {authenticated ? (
              <SignedInMenu signOut={this.handleSignOut} username={userName} />
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

const mapStateToProps = state => {
  return {
    userName: state.auth.user ? state.auth.user.username : null,
    authenticated: state.auth.authenticated
  };
};

const actions = {
  signIn,
  signOut
};

export default connect(mapStateToProps, actions)(withRouter(NavBar));
