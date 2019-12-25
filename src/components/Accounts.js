import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listAccounts } from "../graphql/queries";
import AccountItem from "./AccountItem";

class Accounts extends Component {
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
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <h3>Accounts</h3>
        <div className="ui relaxed list">
          {accounts.map(account => {
            return <AccountItem account={account} key={account.id} />;
          })}
        </div>
      </div>
    );
  }
}

export default Accounts;
