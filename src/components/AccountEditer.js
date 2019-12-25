import React, { Component } from "react";

class AccountEditer extends Component {
  render() {
    const account = this.props.account;
    return <div>Edit Acocunt: {account.id}</div>;
  }
}

export default AccountEditer;
