import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listAccounts } from "../graphql/queries";
import AccountItem from "./AccountItem";

class AccountDisplay extends Component {
  state = {
    accountId: "",
    accounts: []
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listAccounts));

    this.setState({ accounts: result.data.listAccounts.items });
  };

  handleDisplayAccount = account => {
    this.props.onDisplayAccount(account);
  };

  handleEditAccount = account => {
    this.props.onEditAccount(account);
  };

  render() {
    const accounts = this.state.accounts;
    return (
      <>
        <h3>Accounts</h3>
        <div className="ui middle aligned divided list">
          {accounts.map(account => {
            return (
              <AccountItem
                account={account}
                key={account.id}
                onEditAccount={this.handleEditAccount}
                onDisplayAccount={this.handleDisplayAccount}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default AccountDisplay;
