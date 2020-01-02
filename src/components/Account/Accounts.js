import React, { Component } from "react";
import { Auth } from "aws-amplify";
import AccountList from "./AccountList";
import AccountAdd from "./AccountAdd";
import AccountDisplay from "./AccountDisplay";
import AccountEdit from "./AccountEdit";

class Accounts extends Component {
  state = {
    userId: "",
    userName: "",
    isLoading: true,
    operation: "list", // list, display, add, edit
    selectedAccount: "" // selected Account
  };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({ userId: user.attributes.sub, userName: user.username });
    });

    this.setState({ isLoading: !this.state.isLoading });
  };

  handleAddAccount = () => {
    this.setState({ operation: "add" });
  };

  handleEditAccount = account => {
    this.setState({ selectedAccount: account, operation: "edit" });
  };

  handleDisplayAccount = account => {
    this.setState({ selectedAccount: account, operation: "display" });
  };

  handleListAccounts = () => {
    this.setState({ operation: "list" });
  };

  handleAddTransaction = account => {
    this.props.history.push("/transactions/new", { account: account });
  };

  // Add Account
  renderAdd() {
    return (
      <AccountAdd
        userId={this.state.userId}
        onListAccounts={this.handleListAccounts}
      />
    );
  }

  // Edit Account
  renderEdit() {
    return (
      <>
        <AccountEdit
          useId={this.state.userId}
          account={this.state.selectedAccount}
          onListAccounts={this.handleListAccounts}
        />
      </>
    );
  }

  // Display single Account
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
        <button
          className={`ui labeled icon button primary ${this.state.loadingClass}`}
          onClick={this.handleAddAccount}
        >
          <i className="add icon"></i>
          Account
        </button>
        <AccountList
          userId={this.state.userId}
          onEditAccount={this.handleEditAccount}
          onDisplayAccount={this.handleDisplayAccount}
        />
      </>
    );
  }

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

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>;
    } else {
      return (
        <div className="ui main container" style={{ paddingTop: "20px" }}>
          <h4 className="ui dividing header">Accounts</h4>
          {this.renderAccount()}
        </div>
      );
    }
  }
}

export default Accounts;
