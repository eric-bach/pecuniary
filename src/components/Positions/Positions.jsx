import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "semantic-ui-react";
import { fetchPositions } from "../../domain/position/actions";

class Positions extends Component {
  componentDidMount() {
    this.props.fetchPositions(this.props.aggregateId);
  }

  render() {
    const { positions } = this.props;

    return (
      <div>
        <h2>Positions</h2>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Shares</Table.HeaderCell>
              <Table.HeaderCell>ACB</Table.HeaderCell>
              <Table.HeaderCell>Book Value</Table.HeaderCell>
              <Table.HeaderCell>Market Value</Table.HeaderCell>
              <Table.HeaderCell>Profit/Loss</Table.HeaderCell>
              <Table.HeaderCell>P/L %</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {positions.map(p => {
              var pl = p.bookValue.toFixed(2) - 0;
              var plPer = (pl / p.bookValue.toFixed(2)) * 100;
              return (
                <Table.Row key={p.id}>
                  <Table.Cell>{p.symbol}</Table.Cell>
                  <Table.Cell>{p.shares}</Table.Cell>
                  <Table.Cell>${p.acb.toFixed(2)}</Table.Cell>
                  <Table.Cell>${p.bookValue.toFixed(2)}</Table.Cell>
                  <Table.Cell>${p.marketValue.toFixed(2)}</Table.Cell>
                  <Table.Cell>${(p.marketValue - p.bookValue).toFixed(2)}</Table.Cell>
                  <Table.Cell>${((p.marketValue - p.bookValue) / p.bookValue).toFixed(2)}%</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    positions: state.positions.positions
  };
};

const actions = {
  fetchPositions
};

export default connect(mapStateToProps, actions)(Positions);
