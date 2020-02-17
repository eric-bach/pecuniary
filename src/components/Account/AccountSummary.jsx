import React, { Component } from "react";

class AccountSummary extends Component {
  render() {
    const { account } = this.props;

    return (
      <>
        <div className='header'>
          <div className={`ui horizontal red label`}>{account.accountType.name}</div>
          {account.name}
        </div>
        <div className='content'>
          <div>{account.description}</div>
        </div>
      </>
    );
  }
}

export default AccountSummary;
