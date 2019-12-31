import React, { Component } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createAccount } from "../../graphql/mutations";
import { listAccountTypes } from "../../graphql/queries";

class AccountAdd extends Component {
  state = {
    name: "",
    userId: "",
    description: "",
    accountTypeId: "",
    accountTypes: [],
    createButtonClass: "",
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

    this.setState({ name: "", description: "" });
    this.setState({ createButtonClass: "", cancelButtonClass: "" });

    this.props.onListAccounts();
  };

  handleCancelAddAccount = () => {
    this.props.onListAccounts();
  };

  render() {
    let accountTypeOptionItems = this.state.accountTypes.map(accountType => (
      <option key={accountType.name}>{accountType.name}</option>
    ));

    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <form className="ui form" onSubmit={this.handleAddAccount}>
          <h4 className="ui dividing header">Create Account</h4>
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
              >
                <option value="">(Select Account Type)</option>
                {accountTypeOptionItems}
              </select>
            </div>
          </div>
          <div>
            <button
              className={`ui primary button ${this.state.createButtonClass}`}
              type="submit"
            >
              Create
            </button>

            <button
              className={`ui button ${this.state.cancelButtonClass}`}
              onClick={this.handleCancelAddAccount}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AccountAdd;
