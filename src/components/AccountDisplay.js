import React, { Component } from "react";

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
        <h3>Account</h3>
        <div className="ui list">
          <div className="item">
            <i className="chart line icon" />
            <div className="content">
              <div className="right floated item">
                <button
                  className={`ui labeled icon button primary ${this.state.loadingClass}`}
                  onClick={() => this.handleAddTransaction(this.state.account)}
                >
                  <i className="add icon"></i>
                  Transaction
                </button>
              </div>
              <div className="header">{this.props.account.name}</div>
              <div className="description">
                {this.props.account.description}
              </div>
            </div>
          </div>
          <div className="item">
            <h3>Performance</h3>
            <div className="ui items">
              <div className="item">
                <div className="image">
                  <img alt="" src="../placeholders/image.png" />
                </div>
                <div className="content">
                  <div className="header">Header</div>
                  <div className="meta">
                    <span>Description</span>
                  </div>
                  <div className="description">
                    <img alt="" src="../placeholders/short-paragraph.png" />
                  </div>
                  <div className="extra">Additional Details</div>
                </div>
              </div>
            </div>
          </div>
          <div className="item">
            <h3>Transactions</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountDisplay;
