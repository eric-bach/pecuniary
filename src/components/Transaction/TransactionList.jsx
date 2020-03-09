import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button } from "semantic-ui-react";
import NumberFormat from "react-number-format";

import { fetchTransactions } from "../../domain/transaction/actions";

class TransactionList extends Component {
  handlePrevPageClick = () => {
    this.props.fetchTransactions(this.props.prevToken, this.props.prevToken);
  };

  handleNextPageClick = () => {
    this.props.fetchTransactions(this.props.prevToken, this.props.nextToken);
  };

  componentDidMount() {
    this.props.fetchTransactions(this.props.aggregateId, null);
  }

  render() {
    const { transactions } = this.props;

    return (
      <div>
        <h2>Transaction List</h2>
        <Table selectable color='teal' key='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Shares</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Commission</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {transactions.map(t => {
              let color = t.transactionType.name === "Buy" ? "blue" : "red";

              const price = t.price; // ? t.price.toFixed(2) : 0;
              const commission = t.commission; // ? t.commission.toFixed(2) : 0;

              return (
                <Table.Row key={t.id}>
                  <Table.Cell className={`ui ${color} label`} style={{ margin: "8px" }}>
                    {t.transactionType.name}
                  </Table.Cell>
                  <Table.Cell>{new Date(t.transactionDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{t.symbol}</Table.Cell>
                  <Table.Cell>{t.shares}</Table.Cell>
                  <Table.Cell>
                    <NumberFormat value={price} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                  </Table.Cell>
                  <Table.Cell>
                    <NumberFormat value={commission} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>

        <Button.Group>
          <Button labelPosition='left' icon='left chevron' content='Previous' onClick={this.handlePrevPageClick} />
          <Button labelPosition='right' icon='right chevron' content='Next' onClick={this.handleNextPageClick} />
        </Button.Group>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.async.loading,
    transactions: state.transaction.transactions,
    prevToken: state.transaction.prevToken,
    nextToken: state.transaction.nextToken
  };
};

const actions = {
  fetchTransactions
};

export default connect(mapStateToProps, actions)(TransactionList);
