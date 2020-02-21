import React, { Component } from "react";

class TransactionList extends Component {
  render() {
    console.log(this.props.transactions);
    return (
      <div>
        <h2>Transaction List</h2>
        <div className='ui middle aligned divided list'>
          <table className='ui striped table'>
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
              {this.props.transactions.items.map(t => {
                let color = t.transactionType.name === "Buy" ? "blue" : "red";
                return (
                  <tr key={t.id}>
                    <td className={`ui ${color} label`}>{t.transactionType.name}</td>
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
      </div>
    );
  }
}

export default TransactionList;
