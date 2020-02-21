import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class TransactionList extends Component {
  render() {
    return (
      <div>
        <h2>Transaction List</h2>
        <Table selectable>
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
            {this.props.transactions.items.map(t => {
              let color = t.transactionType.name === "Buy" ? "blue" : "red";
              return (
                <Table.Row key={t.id}>
                  <Table.Cell className={`ui ${color} label`} style={{ margin: "8px" }}>
                    {t.transactionType.name}
                  </Table.Cell>
                  <Table.Cell>{t.transactionDate}</Table.Cell>
                  <Table.Cell>{t.symbol}</Table.Cell>
                  <Table.Cell>{t.shares}</Table.Cell>
                  <Table.Cell>${t.price}</Table.Cell>
                  <Table.Cell>${t.commission}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default TransactionList;
