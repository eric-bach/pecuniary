import React, { Component } from "react";
import { connect } from "react-redux";

class AccountDetail extends Component {
  render() {
    const { account } = this.props;

    return <div>AccountDetail: {account.name}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountId = ownProps.match.params.id;

  let account = {};

  if (accountId && state.accounts.accounts.length > 0) {
    account = state.accounts.accounts.filter(account => account.id === accountId)[0];
  }

  return {
    account
  };
};

export default connect(mapStateToProps)(AccountDetail);
