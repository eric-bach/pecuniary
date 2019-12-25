import React, { Component } from "react";
import DisplayAccount from "./DisplayAccount";
import NewAccount from "./NewAccount";

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
            <DisplayAccount />
            <button
              className={`ui labeled icon button primary ${this.state.loadingClass}`}
              onClick={this.handleAddAccountClick}
            >
              <i className="add icon"></i>
              Account
            </button>
          </>
        ) : (
          <NewAccount onDisplayAccount={this.handleDisplayAccount} />
        )}
      </div>
    );
  }
}

export default Accounts;
