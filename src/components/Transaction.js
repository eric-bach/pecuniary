import React, { Component } from "react";

class Transaction extends Component {
  state = { operation: "display" };

  handleAddTransactionClick = () => {};

  renderTransaction() {
    switch (this.state.operation) {
      case "add":
        return this.renderAdd();
      case "edit":
        return this.renderEdit();
      default:
        return this.renderDisplay();
    }
  }

  renderAdd() {
    return <div>Add Transaction</div>;
  }

  renderEdit() {
    return <div>Edit Transaction</div>;
  }

  renderDisplay() {
    return (
      <>
        <h2>Transactions</h2>
        <button
          className={`ui labeled icon button primary ${this.state.loadingClass}`}
          onClick={this.handleAddTransactionClick}
        >
          <i className="add icon"></i>
          Transaction
        </button>
      </>
    );
  }

  render() {
    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        {this.renderTransaction()}
      </div>
    );
  }
}

export default Transaction;
