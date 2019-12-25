import React, { Component } from "react";
import AccountDisplay from "./AccountDisplay";
import AddAccount from "./AddAccount";

class Accounts extends Component {
  state = {
    addAccount: false
  };

  handleAddAccountClick = () => {
    this.setState({ addAccount: true });
  };

  handleDisplayAccount = () => {
    this.setState({ addAccount: false });
  };

  render() {
    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        {!this.state.addAccount ? (
          <>
            <AccountDisplay />
            <button
              className={`ui labeled icon button primary ${this.state.loadingClass}`}
              onClick={this.handleAddAccountClick}
            >
              <i className="add icon"></i>
              Account
            </button>
          </>
        ) : (
          <AddAccount onDisplayAccount={this.handleDisplayAccount} />
        )}
      </div>
    );
  }
}

export default Accounts;
