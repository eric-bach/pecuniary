import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Auth } from "aws-amplify";
import faker from "faker";

class Navbar extends Component {
  state = { userName: "" };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({
        userName: user.username
      });
    });
  };

  handleLogout = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <div className="ui inverted menu">
          <div className="ui container">
            <div className="header item">
              <img className="logo" alt="" src="../favicon-32x32.png" />
              <NavLink to="/">Pecuniary</NavLink>
            </div>
            <div className="item">
              <NavLink to="/accounts/">Accounts</NavLink>
            </div>
            <div className="right menu">
              <div className="item">
                <NavLink to="/reset/">Reset</NavLink>
              </div>
              <img
                className="ui avatar image"
                alt=""
                // src="../placeholders/square-image.png"
                src={faker.image.avatar()}
                style={{ marginTop: "12px" }}
              />
              <span className="item">Welcome, {this.state.userName}</span>
              <a
                href="/"
                onClick={this.handleLogout}
                className="item"
                data-test="sign-out-button"
              >
                Logout
              </a>
            </div>
          </div>
        </div>

        <div
          className="ui bottom fixed inverted menu"
          style={{ paddingTop: "10px" }}
        >
          <div className="ui container">
            <div style={{ color: "white" }}>
              &copy; {new Date().getFullYear()} Pecuniary. All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
