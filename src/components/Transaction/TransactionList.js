import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listTransactions } from "../../graphql/queries";

class TransactionList extends Component {
  state = {
    account: this.props.account,
    transactions: []
  };

  componentDidMount = async () => {
    // TODO Find a better way to select transactions for an account
    const result = await API.graphql(graphqlOperation(listTransactions));
    const transactions = result.data.listTransactions.items.filter(
      t => t.account.id === this.state.account.id
    );

    this.setState({ transactions: transactions });
  };

  render() {
    if (this.state.transactions.length <= 0) {
      return (
        <div className="ui middle aligned divided list">
          No transactions found
        </div>
      );
    } else {
      return (
        <div className="ui middle aligned divided list">
          <table className="ui striped table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Security</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {this.state.transactions.map(t => {
                let color = t.transactionType.name === "Buy" ? "blue" : "red";
                return (
                  <tr key={t.id}>
                    <td className={`ui ${color} label`}>
                      {t.transactionType.name}
                    </td>
                    <td>{t.transactionDate}</td>
                    <td>{t.security.name}</td>
                    <td>{t.shares}</td>
                    <td>{t.price}</td>
                    <td>{t.commission}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default TransactionList;
