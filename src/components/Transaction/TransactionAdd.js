import React, { Component } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { listTransactionTypes } from "../../graphql/queries";
import moment from "moment";
import { createEvent } from "../../graphql/mutations";
import AccountSummary from "../Account/AccountSummary";
import "./TransactionAdd.css";

class TransactionAdd extends Component {
  state = {
    isLoading: false,
    userId: "",
    account: this.props.location.state.account,

    transactionTypes: [],
    transactionTypeId: "",
    transactionDate: moment().format("YYYY-MM-DD"),
    symbol: "",
    shares: "",
    price: "",
    commission: "",

    createTransactionClass: "",
    cancelTransactionClass: ""
  };

  componentDidMount = async () => {
    this.setState({ isLoading: !this.state.isLoading });

    await Auth.currentUserInfo().then(user => {
      this.setState({ userId: user.attributes.sub, userName: user.username });
    });

    const result = await API.graphql(graphqlOperation(listTransactionTypes));
    this.setState({ transactionTypes: result.data.listTransactionTypes.items });

    this.setState({ isLoading: !this.state.isLoading });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAddTransaction = async event => {
    event.preventDefault();

    if (this.state.securityNotFound) {
      return;
    }

    this.setState({
      createTransactionClass: "loading",
      cancelTransactionClass: "disabled"
    });

    // Create Transaction
    const uuidv4 = require("uuid/v4");
    const input = {
      aggregateId: uuidv4(),
      version: 1,
      name: "TransactionCreatedEvent",
      data: JSON.stringify({
        symbol: this.state.symbol,
        transactionReadModelAccountId: this.state.account.id,
        transactionReadModelTransactionTypeId: this.state.transactionTypeId,
        // Format to AWSDate yyyy-MM-dd-07:00
        transactionDate:
          this.state.transactionDate +
          (new Date().getTimezoneOffset() / 60 < 10 ? "-0" : "-") +
          new Date().getTimezoneOffset() / 60 +
          ":00",
        shares: this.state.shares,
        price: this.state.price,
        commission: this.state.commission,
        createdDate: new Date().toISOString()
      }),
      userId: this.state.userId,
      timestamp: new Date().toISOString()
    };
    await API.graphql(graphqlOperation(createEvent, { input }));

    this.setState({ createTransactionClass: "", cancelTransactionClass: "" });

    this.props.history.push("/accounts");
  };

  handleTransactionTypeChange = event => {
    var value = this.state.transactionTypes.filter(function(item) {
      return item.name === event.target.value;
    });
    this.setState({ transactionTypeId: value[0].id });
  };

  listAccounts = () => {
    this.props.history.push("/accounts");
  };

  render() {
    if (this.state.isLoading) {
      return <div className="ui active centered inline loader"></div>;
    } else {
      let transactionTypeOptionItems = this.state.transactionTypes.map(
        transactionType => (
          <option key={transactionType.name}>{transactionType.name}</option>
        )
      );

      return (
        <div className="ui main container" style={{ paddingTop: "20px" }}>
          <div className="ui grid">
            <div className="eight wide column">
              <h4 className="ui dividing header">Account</h4>
              <div className="ui list">
                <div className="item">
                  <AccountSummary account={this.state.account} />
                </div>
              </div>

              <h4 className="ui dividing header">Transaction</h4>
              <form className="ui form" onSubmit={this.handleAddTransaction}>
                <div className="fields">
                  <div className="eight wide field">
                    <label>Transaction Type</label>
                    <select
                      className="ui fluid dropdown"
                      onChange={this.handleTransactionTypeChange}
                      data-test="transaction-type-selector"
                      required
                    >
                      <option value="">(Select Transaction Type)</option>
                      {transactionTypeOptionItems}
                    </select>
                  </div>

                  <div className="eight wide field">
                    <label>Transaction Date</label>
                    <div className="field">
                      <input
                        type="date"
                        name="transactionDate"
                        data-test="transaction-date-input"
                        required
                        value={this.state.transactionDate}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="fields">
                  <div className="four wide field">
                    <label>Symbol</label>
                    <input
                      type="text"
                      name="symbol"
                      required
                      placeholder="Symbol"
                      value={this.state.symbol}
                      onChange={this.handleInputChange}
                      data-test="symbol-input"
                    />
                  </div>
                  <div className="four wide field">
                    <label>Shares</label>
                    <div className="field">
                      <input
                        type="number"
                        name="shares"
                        placeholder="Shares"
                        required
                        value={this.state.shares}
                        onChange={this.handleInputChange}
                        data-test="shares-input"
                      />
                    </div>
                  </div>
                  <div className="four wide field">
                    <label>Price</label>
                    <div className="field">
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        required
                        value={this.state.price}
                        onChange={this.handleInputChange}
                        data-test="price-input"
                      />
                    </div>
                  </div>
                  <div className="four wide field">
                    <label>Commission</label>
                    <div className="field">
                      <input
                        type="number"
                        name="commission"
                        placeholder="Commission"
                        required
                        value={this.state.commission}
                        onChange={this.handleInputChange}
                        data-test="commission-input"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className={`ui primary button ${this.state.createTransactionClass}`}
                    type="submit"
                    data-test="create-transaction-button"
                  >
                    Create
                  </button>

                  <button
                    className={`ui button ${this.state.cancelTransactionClass}`}
                    onClick={this.listAccounts}
                    data-test="cancel-create-transaction-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default TransactionAdd;
