import React, { Component } from "react";
import AccountList from "./AccountList";
import AccountAdd from "./AccountAdd";
import AccountDisplay from "./AccountDisplay";
import AccountEdit from "./AccountEdit";

class Accounts extends Component {
  state = {
    operation: "list", // list, display, add, edit
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
    this.setState({ selectedAccount: account });
    this.setState({ operation: "display" });
  };

  handleDisplayAllAccounts = () => {
    this.setState({ operation: "list" });
  };

  renderAccount() {
    switch (this.state.operation) {
      case "add":
        return this.renderAdd();
      case "edit":
        return this.renderEdit();
      case "display":
        return this.renderDisplay();
      default:
        return this.renderList();
    }
  }

  // Add Account
  renderAdd() {
    return <AccountAdd onDisplayAccount={this.handleDisplayAllAccounts} />;
  }

  // Edit Account
  renderEdit() {
    return (
      <>
        <AccountEdit
          account={this.state.selectedAccount}
          onDisplayAccount={this.handleDisplayAllAccounts}
        />
      </>
    );
  }

  renderDisplay() {
    return <AccountDisplay account={this.state.selectedAccount} />;
  }

  // Display list of Accounts
  renderList() {
    return (
      <>
        <AccountList
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
