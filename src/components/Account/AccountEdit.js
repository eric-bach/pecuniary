import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createEvent } from "../../graphql/mutations";
import { listAccountTypes } from "../../graphql/queries";

class AccountEdit extends Component {
  state = {
    id: this.props.account.id,
    userId: this.props.userId,
    version: this.props.account.version,
    aggregateId: this.props.account.aggregateId,
    name: this.props.account.name,
    description: this.props.account.description,
    accountTypeId: this.props.account.accountType.id,
    accountTypeName: this.props.account.accountType.name,
    accountTypes: [],
    updateButtonClass: "",
    deleteButtonClass: "",
    cancelButtonClass: ""
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listAccountTypes));

    this.setState({ accountTypes: result.data.listAccountTypes.items });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAccountTypeChange = event => {
    var value = this.state.accountTypes.filter(function(item) {
      return item.name === event.target.value;
    });

    this.setState({
      accountTypeId: value[0].id,
      accountTypeName: value[0].name
    });
  };

  handleEditAccount = async event => {
    event.preventDefault();

    this.setState({
      updateButtonClass: "loading",
      deleteButtonClass: "disabled",
      cancelButtonClass: "disabled"
    });

    // Edit Account
    const input = {
      aggregateId: this.state.aggregateId,
      name: "AccountUpdatedEvent",
      version: this.state.version + 1,
      data: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        accountAccountTypeId: this.state.accountTypeId
      }),
      userId: this.state.userId,
      timestamp: new Date().toISOString()
    };
    await API.graphql(graphqlOperation(createEvent, { input }));

    this.setState({
      updateButtonClass: "",
      deleteButtonClass: "",
      cancelButtonClass: ""
    });

    this.listAccounts();
  };

  handleDeleteAccount = async event => {
    event.preventDefault();

    this.setState({
      updateButtonClass: "disabled",
      deleteButtonClass: "loading",
      cancelButtonClass: "disabled"
    });

    // Delete Account
    const input = {
      id: this.state.id,
      aggregateId: this.state.aggregateId,
      name: "AccountDeletedEvent",
      version: this.state.version + 1,
      data: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        accountAccountTypeId: this.state.accountTypeId
      }),
      userId: this.state.userId,
      timestamp: new Date().toISOString()
    };
    await API.graphql(graphqlOperation(createEvent, { input }));

    this.setState({
      updateButtonClass: "",
      deleteButtonClass: "",
      cancelButtonClass: ""
    });

    this.listAccounts();
  };

  listAccounts = () => {
    this.props.onListAccounts();
  };

  render() {
    let accountTypeOptionItems = this.state.accountTypes.map(accountType => (
      <option key={accountType.name}>{accountType.name}</option>
    ));

    return (
      <form className="ui form" onSubmit={this.handleEditAccount}>
        <div className="fields">
          <div className="eight wide field">
            <label>Name</label>
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Account Name"
              required
              data-test="account-name-input"
              value={this.state.name}
              onChange={this.handleInputChange}
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
              data-test="account-description-input"
              value={this.state.description}
              onChange={this.handleInputChange}
            />
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <label>Type</label>
            <select
              className="ui fluid dropdown"
              data-test="account-type-selector"
              onChange={this.handleAccountTypeChange}
              value={this.state.accountTypeName}
              required
            >
              <option value="">(Select Account Type)</option>
              {accountTypeOptionItems}
            </select>
          </div>
        </div>
        <div className="fields">
          <div className="eight wide field">
            <button
              className={`ui primary button ${this.state.updateButtonClass}`}
              data-test="edit-account-button"
              type="submit"
            >
              Update
            </button>
            <button
              className={`ui button red ${this.state.deleteButtonClass}`}
              data-test="delete-account-button"
              onClick={this.handleDeleteAccount}
            >
              Delete
            </button>
            <button
              className={`ui button ${this.state.cancelButtonClass}`}
              data-test="cancel-edit-account-button"
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

export default AccountEdit;
