import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listTransactionReadModels } from "../../graphql/queries.js";

class TransactionList extends Component {
  state = {
    isLoading: false,
    account: this.props.account,
    transactions: []
  };

  componentDidMount = async () => {
    this.setState({ isLoading: !this.state.isLoading });

    // TODO Find a better way to select transactions for an account
    const result = await API.graphql(
      graphqlOperation(listTransactionReadModels)
    );

    const transactions = result.data.listTransactionReadModels.items
      .filter(t => t.account.id === this.state.account.id)
      .sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));

    this.setState({
      transactions: transactions,
      isLoading: !this.state.isLoading
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div className="ui active centered inline loader"></div>;
    } else if (this.state.transactions.length <= 0) {
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
                <th>Symbol</th>
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
                    <td>{t.symbol}</td>
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
