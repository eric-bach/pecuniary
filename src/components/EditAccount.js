import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { updateAccount } from "../graphql/mutations";
import { listAccountTypes } from "../graphql/queries";

class EditAccount extends Component {
  state = {
    id: this.props.account.id,
    name: this.props.account.name,
    description: this.props.account.description,
    accountTypeId: this.props.account.accountType.id,
    accountTypeName: this.props.account.accountType.name,
    accountTypes: [],
    loadingClass: ""
  };

  componentDidMount = async () => {
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
    this.setState({ loadingClass: "loading" });

    const input = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description,
      accountAccountTypeId: this.state.accountTypeId
    };

    await API.graphql(graphqlOperation(updateAccount, { input }));

    this.setState({ loadingClass: "" });
    this.props.onDisplayAccount(false);
  };

  handleCancelEditAccount = () => {
    this.props.onDisplayAccount(false);
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
              >
                <option value="">(Select Account Type)</option>
                {accountTypeOptionItems}
              </select>
            </div>
          </div>
          <div>
            <button
              className={`ui primary button ${this.state.loadingClass}`}
              type="submit"
            >
              Update
            </button>
            <button
              className={`ui button ${this.state.loadingClass}`}
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

export default EditAccount;
