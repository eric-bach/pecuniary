import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "semantic-ui-react";
import NumberFormat from "react-number-format";
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
        <Table selectable color='teal' key='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
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
              const pl = p.marketValue - p.bookValue;
              const plPer = ((p.marketValue - p.bookValue) * 100) / p.bookValue;
              return (
                <Table.Row key={p.id}>
                  <Table.Cell>{p.symbol}</Table.Cell>
                  <Table.Cell>{p.name}</Table.Cell>
                  <Table.Cell>{p.shares}</Table.Cell>
                  <Table.Cell>
                    <NumberFormat value={p.acb.toFixed(2)} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                  </Table.Cell>
                  <Table.Cell>
                    <NumberFormat
                      value={p.bookValue.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <NumberFormat
                      value={p.marketValue.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <NumberFormat value={pl.toFixed(2)} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <NumberFormat value={plPer.toFixed(2)} displayType={"text"} thousandSeparator={true} suffix={"%"} />
                  </Table.Cell>
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
