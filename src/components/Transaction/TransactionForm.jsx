import React, { Component } from "react";
import AccountSummary from "../Account/AccountSummary";

class TransactionForm extends Component {
  render() {
    const account = this.props.location.state.account;

    return (
      <>
        <AccountSummary key={account.aggregateId} account={account} displayButtons={false} data-test='account-label' />
        <div>
          <h2>Transaction Form</h2>
        </div>
      </>
    );
  }
}

export default TransactionForm;
