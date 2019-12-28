import React, { Component } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listAccounts } from "../graphql/queries";
import AccountItem from "./AccountItem";

class AccountList extends Component {
  state = {
    accountId: "",
    userId: "",
    accounts: []
  };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });
    });

    const result = await API.graphql(
      graphqlOperation(listAccounts, {
        filter: {
          userId: {
            eq: this.state.userId
          }
        }
      })
    );

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

export default AccountList;
