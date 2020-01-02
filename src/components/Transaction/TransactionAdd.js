import React, { Component } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { listTransactionTypes, listSecuritys } from "../../graphql/queries";
import moment from "moment";
import { createTransaction } from "../../graphql/mutations";
import SecurityAdd from "../Security/SecurityAdd";

class TransactionAdd extends Component {
  state = {
    userId: "",
    account: this.props.location.state.account,
    isLoading: true,

    transactionTypes: [],
    transactionTypeId: "",
    transactionDate: moment().format("YYYY-MM-DD"),
    shares: "",
    price: "",
    commission: "",

    securityName: "",
    security: "",

    securityClassName: "",
    securityNotFound: false,
    showCreateSecurity: false
  };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({ userId: user.attributes.sub, userName: user.username });
    });

    const result = await API.graphql(graphqlOperation(listTransactionTypes));
    this.setState({ transactionTypes: result.data.listTransactionTypes.items });

    const securities = await API.graphql(graphqlOperation(listSecuritys));
    this.setState({ securities: securities.data.listSecuritys.items });

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

    this.setState({ loadingClass: "loading" });

    const input = {
      transactionTransactionTypeId: this.state.transactionTypeId,
      transactionSecurityId: this.state.security.id,
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
    };

    await API.graphql(graphqlOperation(createTransaction, { input }));

    this.setState({ loadingClass: "" });
  };

  handleTransactionTypeChange = event => {
    var value = this.state.transactionTypes.filter(function(item) {
      return item.name === event.target.value;
    });
    this.setState({ transactionTypeId: value[0].id });
  };

  handleSecurityChange = event => {
    this.setState({
      securityNotFound: false,
      securityClassName: "",
      securityName: event.target.value
    });
  };

  handleSecurityBlur = async event => {
    const result = await API.graphql(
      graphqlOperation(listSecuritys, {
        filter: {
          name: { eq: event.target.value },
          userId: { eq: this.state.userId }
        }
      })
    );

    if (result.data.listSecuritys.items.length !== 1) {
      this.setState({ securityNotFound: true, securityClassName: "warning" });
      return;
    }

    this.setState({
      securityNotFound: false,
      security: result.data.listSecuritys.items[0]
    });
  };

  handleCreateSecurity = () => {
    this.setState({ showCreateSecurity: !this.state.showCreateSecurity });
  };

  securityCreated = () => {
    this.setState({
      securityNotFound: false,
      securityClassName: "",
      showCreateSecurity: !this.state.showCreateSecurity
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading</div>;
    } else {
      let transactionTypeOptionItems = this.state.transactionTypes.map(
        transactionType => (
          <option key={transactionType.name}>{transactionType.name}</option>
        )
      );

      return (
        <div className="ui main container" style={{ paddingTop: "20px" }}>
          <h4 className="ui dividing header">Transaction</h4>
          <div className="ui grid">
            <div className="eight wide column">
              <form className="ui form" onSubmit={this.handleAddTransaction}>
                <div className="field">
                  <label>Transaction Type</label>
                  <select
                    className="ui fluid dropdown"
                    onChange={this.handleTransactionTypeChange}
                    required
                  >
                    <option value="">(Select Transaction Type)</option>
                    {transactionTypeOptionItems}
                  </select>
                </div>
                <div className="field">
                  <div className="field">
                    <div className={`ui form ${this.state.securityClassName}`}>
                      <div className="field">
                        <label>Security</label>
                      </div>
                      <input
                        type="text"
                        name="security"
                        required
                        placeholder="Security"
                        value={this.state.securityName}
                        onChange={this.handleInputChange}
                        onBlur={this.handleSecurityBlur}
                      />
                      {this.state.securityNotFound && (
                        <div className="ui warning message">
                          <div className="header">Security not found</div>
                          <p>
                            Security {this.state.securityName} does not exist.
                            Do you want to{" "}
                            <a
                              href="#Transaction"
                              onClick={this.handleCreateSecurity}
                            >
                              create it?
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label>Transaction Date</label>
                  <div className="field">
                    <input
                      type="date"
                      name="transactionDate"
                      required
                      value={this.state.transactionDate}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Shares</label>
                  <div className="field">
                    <input
                      type="number"
                      name="shares"
                      placeholder="Shares"
                      required
                      value={this.state.shares}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Price</label>
                  <div className="field">
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      required
                      value={this.state.price}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Commission</label>
                  <div className="field">
                    <input
                      type="number"
                      name="commission"
                      placeholder="Commission"
                      required
                      value={this.state.commission}
                      onChange={this.handleInputChange}
                    />
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
            <div className="eight wide column">
              {this.state.showCreateSecurity && (
                <SecurityAdd
                  name={this.state.securityName}
                  onSecurityCreated={this.securityCreated}
                />
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default TransactionAdd;
