import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createAccount } from "../../graphql/mutations";
import { listAccountTypes } from "../../graphql/queries";

class AccountAdd extends Component {
  state = {
    userId: this.props.userId,
    name: "",
    description: "",
    accountTypeId: "",
    accountTypes: [],
    createButtonClass: "",
    cancelButtonClass: ""
  };

  componentDidMount = async () => {
    await API.graphql(graphqlOperation(listAccountTypes)).then(result => {
      this.setState({ accountTypes: result.data.listAccountTypes.items });
    });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAccountTypeChange = event => {
    var value = this.state.accountTypes.filter(function(item) {
      return item.name === event.target.value;
    });

    this.setState({ accountTypeId: value[0].id });
  };

  handleAddAccount = async event => {
    event.preventDefault();

    this.setState({
      createButtonClass: "loading",
      cancelButtonClass: "disabled"
    });

    const input = {
      name: this.state.name,
      userId: this.state.userId,
      description: this.state.description,
      accountAccountTypeId: this.state.accountTypeId
    };

    await API.graphql(graphqlOperation(createAccount, { input }));

    this.setState({
      name: "",
      description: "",
      accountTYpeId: "",
      createButtonClass: "",
      cancelButtonClass: ""
    });

    this.listAccounts();
  };

  listAccounts = () => {
    this.props.onListAccounts();
  };

  render() {
    let accountTypeItems = this.state.accountTypes.map(accountType => (
      <option key={accountType.id}>{accountType.name}</option>
    ));

    return (
      <form className="ui form" onSubmit={this.handleAddAccount}>
        <div className="fields">
          <div className="eight wide field">
            <label>Name</label>
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Account Name"
              required
              value={this.state.name}
              onChange={this.handleInputChange}
              data-test="account-name-input"
            />
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Account Description"
              required
              value={this.state.description}
              onChange={this.handleInputChange}
              data-test="account-description-input"
            />
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label>Type</label>
            <select
              className="ui fluid dropdown"
              onChange={this.handleAccountTypeChange}
              required
              data-test="account-type-selector"
            >
              <option value="">(Select Account Type)</option>
              {accountTypeItems}
            </select>
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <button
              className={`ui primary button ${this.state.createButtonClass}`}
              data-test="create-account-button"
              type="submit"
            >
              Create
            </button>
            <button
              className={`ui button ${this.state.cancelButtonClass}`}
              data-test="cancel-create-account-button"
              onClick={this.listAccounts}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default AccountAdd;
