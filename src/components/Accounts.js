import React, { Component } from "react";
import AccountDisplay from "./AccountDisplay";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";

class Accounts extends Component {
  state = {
    operation: "display", // display, add, edit
    selectedAccount: "" // selected Account
  };

  handleAddAccountClick = () => {
    this.setState({ operation: "add" });
  };

  handleEditAccount = account => {
    this.setState({ selectedAccount: account });
    this.setState({ operation: "edit" });
  };

  handleDisplayAccount = account => {
    console.log("Display account: " + account.id);
  };

  handleDisplayAllAccounts = () => {
    this.setState({ operation: "display" });
  };

  renderAccount() {
    switch (this.state.operation) {
      case "add":
        return this.renderAdd();
      case "edit":
        return this.renderEdit();
      default:
        return this.renderDisplay();
    }
  }

  // Add Account
  renderAdd() {
    return <AddAccount onDisplayAccount={this.handleDisplayAllAccounts} />;
  }

  // Edit Account
  renderEdit() {
    return (
      <>
        <EditAccount
          account={this.state.selectedAccount}
          onDisplayAccount={this.handleDisplayAllAccounts}
        />
      </>
    );
  }

  // Display list of Accounts
  renderDisplay() {
    return (
      <>
        <AccountDisplay
          onEditAccount={this.handleEditAccount}
          onDisplayAccount={this.handleDisplayAccount}
        />
        <button
          className={`ui labeled icon button primary ${this.state.loadingClass}`}
          onClick={this.handleAddAccountClick}
        >
          <i className="add icon"></i>
          Account
        </button>
      </>
    );
  }

  render() {
    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        {this.renderAccount()}
      </div>
    );
  }
}

export default Accounts;
