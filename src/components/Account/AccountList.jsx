import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";

import Loading from "../App/Loading";
import AccountSummary from "./AccountSummary";
import { fetchAccounts } from "../../domain/account/actions";

class AccountList extends Component {
  componentDidMount = async () => {
    this.props.fetchAccounts();
  };

  render() {
    const { loading, accounts } = this.props;

    if (loading) return <Loading />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <h2>Accounts</h2>
          {accounts.map(account => {
            return <AccountSummary key={account.aggregateId} account={account} data-test='account-label' />;
          })}
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Summary</h2>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.async.loading,
    accounts: state.accounts.accounts
  };
};

export default connect(mapStateToProps, { fetchAccounts })(AccountList);
