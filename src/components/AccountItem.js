import React, { Component } from "react";

class AccountItem extends Component {
  handleEditAccountClick = account => {
    this.props.onEditAccount(account);
  };

  render() {
    const account = this.props.account;
    return (
      <div className="item content">
        <a href="#Account" onClick={() => this.handleEditAccountClick(account)}>
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
