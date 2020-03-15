import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import AccountHeader from "../Account/AccountHeader";
import TransactionList from "../Transaction/TransactionList";
import Positions from "../Positions/Positions";
import Graph from "../TimeSeries/Graph";

class AccountDetail extends Component {
  render() {
    const aggregateId = this.props.match.params.id;
    const { account } = this.props.location.state;

    return (
      <>
        <h2>Account</h2>
        <AccountHeader aggregateId={aggregateId} />
        <Graph aggregateId={aggregateId} />
        <Positions aggregateId={aggregateId} />
        <br />
        <Button
          as={Link}
          to={{
            pathname: "/transactions/new",
            state: {
              account: account
            }
          }}
          floated='right'
          positive
          content='Add Transaction'
          data-test='add-transaction-button'
        />
        <TransactionList aggregateId={aggregateId} />
      </>
    );
  }
}

export default AccountDetail;
