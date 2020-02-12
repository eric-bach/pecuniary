import React, { Component } from "react";
import AccountSummary from "./AccountSummary";
import TransactionList from "../Transaction/TransactionList";

class AccountDisplay extends Component {
  state = {
    account: this.props.account,
    loadingClass: ""
  };

  handleAddTransaction = account => {
    this.props.onAddTransaction(account);
  };

  handleEditAccount = account => {
    this.props.onEditAccount(account);
  };

  render() {
    return (
      <div>
        <div className="ui list">
          <div className="item">
            <button
              className={`ui button primary ${this.state.loadingClass}`}
              onClick={() => this.handleEditAccount(this.state.account)}
              data-test="edit-account-button"
            >
              Edit
            </button>
          </div>

          <div className="item">
            <AccountSummary account={this.props.account} />
          </div>

          <h4 className="ui dividing header">Performance</h4>
          <h4 className="ui dividing header">Transactions</h4>
          <div className="item">
            <button
              className={`ui labeled icon button primary ${this.state.loadingClass}`}
              onClick={() => this.handleAddTransaction(this.state.account)}
              data-test="add-transaction-button"
            >
              <i className="add icon"></i>
              Transaction
            </button>
          </div>
          <div className="item">
            <TransactionList account={this.state.account} />
          </div>
        </div>
      </div>
    );
  }
}

export default AccountDisplay;
