import React, { Component } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { updateAccount, deleteAccount } from "../../graphql/mutations";
import { listAccountTypes } from "../../graphql/queries";

class AccountEdit extends Component {
  state = {
    id: this.props.account.id,
    name: this.props.account.name,
    userId: "",
    description: this.props.account.description,
    accountTypeId: this.props.account.accountType.id,
    accountTypeName: this.props.account.accountType.name,
    accountTypes: [],
    updateButtonClass: "",
    deleteButtonClass: "",
    cancelButtonClass: ""
  };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });
    });

    const result = await API.graphql(graphqlOperation(listAccountTypes));

    this.setState({ accountTypes: result.data.listAccountTypes.items });
  };

  handleChangeName = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeDescription = event => {
    this.setState({ description: event.target.value });
  };

  handleAccountTypeChange = event => {
    var value = this.state.accountTypes.filter(function(item) {
      return item.name === event.target.value;
    });

    this.setState({ accountTypeId: value[0].id });
    this.setState({ accountTypeName: value[0].name });
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
    this.props.onListAccounts();
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
    this.props.onListAccounts();
  };

  handleCancelEditAccount = () => {
    this.props.onListAccounts();
  };

  render() {
    let accountTypeOptionItems = this.state.accountTypes.map(accountType => (
      <option key={accountType.name}>{accountType.name}</option>
    ));

    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <form className="ui form" onSubmit={this.handleEditAccount}>
          <h4 className="ui dividing header">Edit Account</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input
                  autoFocus
                  type="text"
                  name="Name"
                  placeholder="Account Name"
                  required
                  value={this.state.name}
                  onChange={this.handleChangeName}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <div className="two fields">
              <div className="field">
                <input
                  type="text"
                  name="Description"
                  placeholder="Account Description"
                  required
                  value={this.state.description}
                  onChange={this.handleChangeDescription}
                />
              </div>
            </div>
          </div>
          <div className="two fields">
            <div className="field">
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
          <div>
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
              onClick={this.handleCancelEditAccount}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AccountEdit;
