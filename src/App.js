import React from "react";
import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";

class App extends React.Component {
  state = {
    authenticated: false
  };

  componentDidMount = async () => {
    const user = await Auth.currentUserInfo();
    this.setState({ authenticated: user !== null });
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
            <a href="/" className="header item">
              <img className="logo" alt="Pecuniary" src="./favicon-32x32.png" />
              Pecuniary
            </a>
            <a className="item">Accounts</a>
            <a className="item">Transactions</a>
            <a className="item">Analytics</a>
            <div className="right menu">
              <div className="item">
                <div className="ui icon input">
                  <input type="text" placeholder="Search..." />
                  <i className="search link icon"></i>
                </div>
              </div>
              {this.state.authenticated === false ? (
                <div className="right menu">
                  <a href="/login" className="item">
                    Login
                  </a>
                  <a href="/signup" className="item">
                    Signup
                  </a>
                </div>
              ) : (
                <div className="right menu">
                  <a href="/" onClick={this.handleLogout} className="item">
                    Logout
                  </a>
                </div>
              )}
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

export default withAuthenticator(App, { includeGreetings: false });
