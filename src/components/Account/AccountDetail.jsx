import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import AccountSummary from "./AccountSummary";

class AccountDetail extends Component {
  render() {
    const account = this.props.location.state.account;

    return (
      <>
        <h2>Account</h2>
        <AccountSummary key={account.aggregateId} account={account} displayButtons={false} data-test='account-label' />
        <Button
          as={Link}
          to={{
            pathname: "/transactions/new",
            state: {
              account: account
            }
          }}
          positive
          content='Add Transaction'
        />
      </>
    );
  }
}

export default AccountDetail;
