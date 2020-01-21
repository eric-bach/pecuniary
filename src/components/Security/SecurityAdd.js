import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createEvent } from "../../graphql/mutations";
import { listExchangeTypes } from "../../graphql/queries";

class SecurityAdd extends Component {
  state = {
    userId: this.props.userId,
    name: this.props.name,
    description: "",
    exchangeTypes: [],
    exchangeTypeId: "",
    createButtonClass: ""
  };

  componentDidMount = async () => {
    const result = await API.graphql(graphqlOperation(listExchangeTypes));
    this.setState({ exchangeTypes: result.data.listExchangeTypes.items });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExchangeTypeChange = event => {
    var value = this.state.exchangeTypes.filter(function(item) {
      return item.name === event.target.value;
    });
    this.setState({ exchangeTypeId: value[0].id });
  };

  handleAddSecurity = async event => {
    event.preventDefault();

    this.setState({ createButtonClass: "loading" });

    // Create Security
    const uuidv4 = require("uuid/v4");
    const input = {
      aggregateId: uuidv4(),
      name: "SecurityCreatedEvent",
      version: 1,
      data: JSON.stringify({
        name: this.state.name,
        userId: this.state.userId,
        description: this.state.description,
        securityExchangeTypeId: this.state.exchangeTypeId
      }),
      userId: this.state.userId,
      timestamp: new Date().toISOString()
    };
    await API.graphql(graphqlOperation(createEvent, { input }));

    this.setState({ name: "", description: "", createButtonClass: "" });

    if (this.props.onSecurityCreated !== undefined) {
      this.props.onSecurityCreated();
    }
  };

  render() {
    let exchangeTypeOptionItems = this.state.exchangeTypes.map(exchangeType => (
      <option key={exchangeType.name}>{exchangeType.name}</option>
    ));

    return (
      <form className="ui form" onSubmit={this.handleAddSecurity}>
        <h4 className="ui dividing header">Create Security</h4>
        <div className="fields">
          <div className="sixteen wide field">
            <label>Name</label>
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Security Name"
              required
              value={this.state.name}
              onChange={this.handleInputChange}
              data-test="security-name-input"
            />
          </div>
        </div>
        <div className="fields">
          <div className="sixteen wide field">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Security Description"
              required
              value={this.state.description}
              onChange={this.handleInputChange}
              data-test="security-description-input"
            />
          </div>
        </div>
        <div className="fields">
          <div className="sixteen wide field">
            <label>Type</label>
            <select
              className="ui fluid dropdown"
              onChange={this.handleExchangeTypeChange}
              data-test="security-exchange-type-selector"
              required
            >
              <option value="">(Select Exchange Type)</option>
              {exchangeTypeOptionItems}
            </select>
          </div>
        </div>
        <div>
          <button
            className={`ui primary button ${this.state.createButtonClass}`}
            data-test="create-security-button"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    );
  }
}

export default SecurityAdd;
