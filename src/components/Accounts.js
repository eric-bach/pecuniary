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

  handleAddAccount = () => {
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

  handleListAccounts = () => {
    this.setState({ operation: "list" });
  };

  handleAddTransaction = account => {
    this.props.history.push("/transactions/new", { account: account });
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
    return <AccountAdd onListAccounts={this.handleListAccounts} />;
  }

  // Edit Account
  renderEdit() {
    return (
      <>
        <AccountEdit
          account={this.state.selectedAccount}
          onListAccounts={this.handleListAccounts}
        />
      </>
    );
  }

  renderDisplay() {
    return (
      <AccountDisplay
        account={this.state.selectedAccount}
        onAddTransaction={this.handleAddTransaction}
      />
    );
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
          onClick={this.handleAddAccount}
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
