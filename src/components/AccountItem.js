import React, { Component } from "react";

class AccountItem extends Component {
  render() {
    const account = this.props.account;
    return (
      <div className="item content">
        <a className="header">{account.name}</a>
        <div className="description">{account.description}</div>
      </div>
    );
  }
}

export default AccountItem;
