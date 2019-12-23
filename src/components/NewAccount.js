import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createAccount } from "../graphql/mutations";
import { listAccountTypes } from "../graphql/queries";

class NewAccount extends Component {
  state = {
    name: "",
    description: "",
    accountTypeId: "",
    accountTypes: []
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listAccountTypes));

    this.setState({ accountTypes: result.data.listAccountTypes.items });

    console.log(this.state.accountTypes);
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
  };

  handleAddAccount = async event => {
    event.preventDefault();

    const input = {
      name: this.state.name,
      description: this.state.description,
      accountAccountTypeId: this.state.accountTypeId
    };

    await API.graphql(graphqlOperation(createAccount, { input }));

    this.setState({ name: "", description: "" });
  };

  render() {
    let accountTypeOptionItems = this.state.accountTypes.map(accountType => (
      <option key={accountType.name}>{accountType.name}</option>
    ));

    return (
      <div className="ui main container">
        <form className="ui form" onSubmit={this.handleAddAccount}>
          <h4 className="ui dividing header">Create Account</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input
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
              >
                <option value="">(Select Account Type)</option>
                {accountTypeOptionItems}
              </select>
            </div>
          </div>
          <div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewAccount;
