import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Button } from "semantic-ui-react";

import Loading from "../App/Loading";
import AccountSummary from "./AccountSummary";
import { fetchAccounts, deleteAccount } from "../../domain/account/actions";

class AccountList extends Component {
  componentDidMount = async () => {
    this.props.fetchAccounts(null);
  };

  handlePrevPageClick = () => {
    this.props.fetchAccounts(this.props.prevToken, this.props.prevToken);
  };

  handleNextPageClick = () => {
    this.props.fetchAccounts(this.props.prevToken, this.props.nextToken);
  };

  handleDeleteAccount = account => {
    this.props.deleteAccount(account);

    this.props.history.push({ pathname: "/processing", state: { message: "Deleting account...", path: "/accounts" } });
  };

  render() {
    const { loading, accounts } = this.props;

    if (loading) return <Loading />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <h2>
            Accounts ({accounts.length})
            <Button
              as={Link}
              to='/accounts/new'
              floated='right'
              positive
              content='Create Account'
              data-test='create-account-button'
            />
          </h2>

          <Button.Group>
            <Button labelPosition='left' icon='left chevron' content='Previous' onClick={this.handlePrevPageClick} />
            <Button labelPosition='right' icon='right chevron' content='Next' onClick={this.handleNextPageClick} />
          </Button.Group>

          {accounts.map(account => {
            return (
              <AccountSummary key={account.aggregateId} account={account} deleteAccount={this.handleDeleteAccount} />
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
    accounts: state.accounts.accounts,
    prevToken: state.accounts.prevToken,
    nextToken: state.accounts.nextToken
  };
};

const actions = {
  fetchAccounts,
  deleteAccount
};

export default connect(mapStateToProps, actions)(AccountList);
