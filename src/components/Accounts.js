import React, { Component } from "react";
import AccountDisplay from "./AccountDisplay";
import AddAccount from "./AddAccount";
import AccountEdit from "./AccountEditer";

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

  handleDisplayAccount = () => {
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
    return <AddAccount onDisplayAccount={this.handleDisplayAccount} />;
  }

  // Edit Account
  renderEdit() {
    return (
      <>
        <AccountEdit account={this.state.selectedAccount}></AccountEdit>
      </>
    );
  }

  // Display list of Accounts
  renderDisplay() {
    return (
      <>
        <AccountDisplay onEditAccount={this.handleEditAccount} />
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
