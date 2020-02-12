import React, { Component } from "react";

class AccountSummary extends Component {
  state = {
    account: this.props.account
  };

  render() {
    return (
      <>
        <div className='header'>
          <div className={`ui horizontal red label`}>
            {this.props.account.accountType.name}
          </div>
          {this.props.account.name}
        </div>
        <div className='content'>
          <div>{this.props.account.description}</div>
        </div>
      </>
    );
  }
}

export default AccountSummary;
