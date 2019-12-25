import React, { Component } from "react";

class AccountItem extends Component {
  render() {
    const account = this.props.account;
    return (
      <div className="item content">
        <a href="#AccountItem">
          <div className="header">
            {account.name} | {account.accountType.name}
          </div>
        </a>
        <div className="description">{account.description}</div>
      </div>
    );
  }
}

export default AccountItem;
