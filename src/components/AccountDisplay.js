import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listAccounts } from "../graphql/queries";
import AccountItem from "./AccountItem";

class AccountDisplay extends Component {
  state = {
    accounts: []
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listAccounts));

    this.setState({ accounts: result.data.listAccounts.items });
  };

  render() {
    const accounts = this.state.accounts;
    return (
      <>
        <h3>Accounts</h3>
        <div className="ui middle aligned divided list">
          {accounts.map(account => {
            return <AccountItem account={account} key={account.id} />;
          })}
        </div>
      </>
    );
  }
}

export default AccountDisplay;
