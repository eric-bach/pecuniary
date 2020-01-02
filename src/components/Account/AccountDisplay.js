import React, { Component } from "react";
import TransactionList from "../Transaction/TransactionList";

class AccountDisplay extends Component {
  state = {
    account: this.props.account,
    loadingClass: ""
  };

  handleAddTransaction = account => {
    this.props.onAddTransaction(account);
  };

  render() {
    return (
      <div>
        <div className="ui list">
          <div className="item">
            <i className="chart line icon" />
            <div className="content">
              <div className="header">{this.props.account.name}</div>
              <div className="description">
                {this.props.account.description}
              </div>
            </div>
          </div>
          <h4 className="ui dividing header">Performance</h4>
          <h4 className="ui dividing header">Transactions</h4>
          <div className="item">
            <button
              className={`ui labeled icon button primary ${this.state.loadingClass}`}
              onClick={() => this.handleAddTransaction(this.state.account)}
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
