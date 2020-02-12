import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { Auth } from "aws-amplify";
import faker from "faker";

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
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} exact to='/home' header>
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

      //   <div className='App'>
      //     <div className='ui inverted menu'>
      //       <div className='ui container'>
      //         <div className='header item'>
      //           <img className='logo' alt='' src='../favicon-32x32.png' />
      //           <NavLink to='/'>Pecuniary</NavLink>
      //         </div>
      //         <div className='item'>
      //           <NavLink to='/accounts/'>Accounts</NavLink>
      //         </div>
      //         <div className='right menu'>
      //           <img
      //             className='ui avatar image'
      //             alt=''
      //             // src="../placeholders/square-image.png"
      //             src={faker.image.avatar()}
      //             style={{ marginTop: "12px" }}
      //           />
      //           <span className='item'>Welcome, {this.state.userName}</span>
      //           <a
      //             href='/'
      //             onClick={this.handleLogout}
      //             className='item'
      //             data-test='sign-out-button'
      //           >
      //             Logout
      //           </a>
      //         </div>
      //       </div>
      //     </div>

      //     <div
      //       className='ui bottom fixed inverted menu'
      //       style={{ paddingTop: "10px" }}
      //     >
      //       <div className='ui container'>
      //         <div style={{ color: "white" }}>
      //           &copy; {new Date().getFullYear()} Pecuniary. All Rights Reserved
      //         </div>
      //       </div>
      //     </div>
      //   </div>
    );
  }
}

export default withRouter(NavBar);
