import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listTransactionTypes } from "../graphql/queries";
import moment from "moment";
import { createTransaction } from "../graphql/mutations";

class TransactionAdd extends Component {
  state = {
    account: this.props.location.state.account,
    security: "",
    transactionTypeId: "",
    transactionTypes: [],
    transactionDate: moment().format("YYYY-MM-DD"),
    shares: "",
    price: "",
    commission: ""
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listTransactionTypes));
    this.setState({ transactionTypes: result.data.listTransactionTypes.items });
  };

  handleSecurityChange = event => {
    this.setState({ security: event.target.value });
  };

  handleTransactionDateChange = event => {
    this.setState({ transactionDate: event.target.value });
  };

  handleSharesChange = event => {
    this.setState({ shares: event.target.value });
  };

  handlePriceChange = event => {
    this.setState({ price: event.target.value });
  };

  handleCommissionChange = event => {
    this.setState({ commission: event.target.value });
  };

  handleAddTransaction = async event => {
    event.preventDefault();
    this.setState({ loadingClass: "loading" });

    const input = {
      transactionTransactionTypeId: this.state.transactionTypeId,
      transactionSecurityId: 1, // hardcoded for now
      transactionAccountId: this.state.account.id,
      // Format to AWSDate yyyy-MM-dd-07:00
      transactionDate:
        this.state.transactionDate +
        (new Date().getTimezoneOffset() / 60 < 10 ? "-0" : "-") +
        new Date().getTimezoneOffset() / 60 +
        ":00",
      shares: this.state.shares,
      price: this.state.price,
      commission: this.state.commission
      //userId: this.state.userId
    };

    console.log(input);

    await API.graphql(graphqlOperation(createTransaction, { input }));

    this.setState({ loadingClass: "" });
  };

  handleTransactionTypeChange = event => {
    var value = this.state.transactionTypes.filter(function(item) {
      return item.name === event.target.value;
    });
    this.setState({ transactionTypeId: value[0].id });
  };

  render() {
    let transactionTypeOptionItems = this.state.transactionTypes.map(
      transactionType => (
        <option key={transactionType.name}>{transactionType.name}</option>
      )
    );

    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <form className="ui form" onSubmit={this.handleAddTransaction}>
          <h4 className="ui dividing header">Create Transaction</h4>
          <div className="two fields">
            <div className="field">
              <label>Transaction Type</label>
              <select
                className="ui fluid dropdown"
                onChange={this.handleTransactionTypeChange}
              >
                <option value="">(Select Transaction Type)</option>
                {transactionTypeOptionItems}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Security</label>
            <div className="two fields">
              <div className="field">
                <input
                  autoFocus
                  type="text"
                  name="security"
                  placeholder="Security"
                  required
                  value={this.state.security}
                  onChange={this.handleSecurityChange}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Transaction Date</label>
            <div className="two fields">
              <div className="field">
                <input
                  type="date"
                  name="transactionDate"
                  required
                  //defaultValue={moment().format("YYYY-MM-DD")}
                  value={this.state.transactionDate}
                  onChange={this.handleTransactionDateChange}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Shares</label>
            <div className="two fields">
              <div className="field">
                <input
                  type="number"
                  name="shares"
                  placeholder="Shares"
                  required
                  value={this.state.shares}
                  onChange={this.handleSharesChange}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Price</label>
            <div className="two fields">
              <div className="field">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handlePriceChange}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Commission</label>
            <div className="two fields">
              <div className="field">
                <input
                  type="number"
                  name="commission"
                  placeholder="Commission"
                  required
                  value={this.state.commission}
                  onChange={this.handleCommissionChange}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              className={`ui primary button ${this.state.loadingClass}`}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default TransactionAdd;
