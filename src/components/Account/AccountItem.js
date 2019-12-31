import React, { Component } from "react";

class AccountItem extends Component {
  handleDisplayAccountClick = account => {
    this.props.onDisplayAccount(account);
  };

  handleEditAccountClick = account => {
    this.props.onEditAccount(account);
  };

  render() {
    const account = this.props.account;
    return (
      <div className="item content" style={{ padding: "10px" }}>
        <a
          className="right floated item"
          href="#AccountEdit"
          onClick={() => this.handleEditAccountClick(account)}
        >
          <i className="edit icon"></i>Edit
        </a>
        <a
          href="#Account"
          onClick={() => this.handleDisplayAccountClick(account)}
        >
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
