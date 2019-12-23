import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Auth } from "aws-amplify";

class Navbar extends Component {
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
            <a className="header item">
              <img className="logo" alt="" src="favicon-32x32.png" />
              <NavLink to="/">Pecuniary</NavLink>
            </a>
            <a className="item">
              <NavLink to="/accounts/">Accounts</NavLink>
            </a>
            <a className="item">
              <NavLink to="/transactions/">Transactions</NavLink>
            </a>
            <a href="/" onClick={this.handleLogout} className="item right menu">
              Logout
            </a>
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
