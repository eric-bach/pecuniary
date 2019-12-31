import React, { Component } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createSecurity } from "../../graphql/mutations";
import { listExchangeTypes } from "../../graphql/queries";

class SecurityAdd extends Component {
  state = {
    name: "",
    userId: "",
    description: "",
    exchangeTypeId: "",
    exchangeTypes: [],
    createButtonClass: ""
  };

  componentDidMount = async () => {
    await Auth.currentUserInfo().then(user => {
      this.setState({
        userId: user.attributes.sub
      });
    });

    const result = await API.graphql(graphqlOperation(listExchangeTypes));
    this.setState({ exchangeTypes: result.data.listExchangeTypes.items });
  };

  handleChangeName = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeDescription = event => {
    this.setState({ description: event.target.value });
  };

  handleExchangeTypeChange = event => {
    var value = this.state.exchangeTypes.filter(function(item) {
      return item.name === event.target.value;
    });
    this.setState({ exchangeTypeId: value[0].id });
  };

  handleAddSecurity = async event => {
    event.preventDefault();

    this.setState({
      createButtonClass: "loading",
      cancelButtonClass: "disabled"
    });

    const input = {
      name: this.state.name,
      userId: this.state.userId,
      description: this.state.description,
      securityExchangeTypeId: this.state.exchangeTypeId
    };

    await API.graphql(graphqlOperation(createSecurity, { input }));

    this.setState({ name: "", description: "" });
    this.setState({ createButtonClass: "", cancelButtonClass: "" });
  };

  render() {
    let exchangeTypeOptionItems = this.state.exchangeTypes.map(exchangeType => (
      <option key={exchangeType.name}>{exchangeType.name}</option>
    ));

    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <form className="ui form" onSubmit={this.handleAddSecurity}>
          <h4 className="ui dividing header">Create Security</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input
                  autoFocus
                  type="text"
                  name="Name"
                  placeholder="Security Name"
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
                onChange={this.handleExchangeTypeChange}
              >
                <option value="">(Select Exchange Type)</option>
                {exchangeTypeOptionItems}
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
          </div>
        </form>
      </div>
    );
  }
}

export default SecurityAdd;
