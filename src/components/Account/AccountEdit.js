import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { updateAccount, deleteAccount } from "../../graphql/mutations";
import { listAccountTypes } from "../../graphql/queries";

class AccountEdit extends Component {
  state = {
    userId: this.props.userId,
    id: this.props.account.id,
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

    const input = {
      id: this.state.id,
      userId: this.state.userId,
      name: this.state.name,
      description: this.state.description,
      accountAccountTypeId: this.state.accountTypeId
    };

    await API.graphql(graphqlOperation(updateAccount, { input }));

    this.setState({
      updateButtonClass: "",
      deleteButtonClass: "",
      cancelButtonClass: ""
    });

    this.listAccounts();
  };

  handleDeleteAccount = async event => {
    this.setState({
      updateButtonClass: "disabled",
      deleteButtonClass: "loading",
      cancelButtonClass: "disabled"
    });

    const input = {
      id: this.state.id
    };

    await API.graphql(graphqlOperation(deleteAccount, { input }));

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
              type="submit"
            >
              Update
            </button>
            <button
              className={`ui button red ${this.state.deleteButtonClass}`}
              onClick={this.handleDeleteAccount}
            >
              Delete
            </button>
            <button
              className={`ui button ${this.state.cancelButtonClass}`}
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
