import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Button } from "semantic-ui-react";
import { API, graphqlOperation } from "aws-amplify";
import {
  onCreateAccountReadModel,
  onUpdateAccountReadModel,
  onDeleteAccountReadModel
} from "../../graphql/subscriptions";

import Loading from "../App/Loading";
import AccountSummary from "./AccountSummary";
import { fetchAccounts, deleteAccount } from "../../domain/account/actions";

class AccountList extends Component {
  componentDidMount = async () => {
    this.props.fetchAccounts();
  };

  handleDeleteAccount = account => {
    this.props.deleteAccount(account);
  };

  createAccountListener = API.graphql(graphqlOperation(onCreateAccountReadModel)).subscribe({
    next: () => {
      this.props.fetchAccounts();
    }
  });

  updateAccountListener = API.graphql(graphqlOperation(onUpdateAccountReadModel)).subscribe({
    next: () => {
      this.props.fetchAccounts();
    }
  });

  deleteAccountListener = API.graphql(graphqlOperation(onDeleteAccountReadModel)).subscribe({
    next: () => {
      this.props.fetchAccounts();
    }
  });

  componentWillUnmount() {
    this.createAccountListener.unsubscribe();
    this.updateAccountListener.unsubscribe();
    this.deleteAccountListener.unsubscribe();
  }

  render() {
    const { loading, accounts } = this.props;

    if (loading) return <Loading />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <h2>
            Accounts ({accounts.length})
            <Button as={Link} to='/accounts/new' floated='right' positive content='Create Account' />
          </h2>

          {accounts.map(account => {
            return (
              <AccountSummary
                key={account.aggregateId}
                account={account}
                deleteAccount={this.handleDeleteAccount}
                displayButtons={true}
                data-test='account-label'
              />
            );
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

const actions = {
  fetchAccounts,
  deleteAccount
};

export default connect(mapStateToProps, actions)(AccountList);
