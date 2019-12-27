import React, { Component } from "react";

class TransactionAdd extends Component {
  state = {
    account: this.props.location.state.account,
    security: ""
  };

  handleSecurityChange = event => {};

  handleAddTransaction = () => {};

  render() {
    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <form className="ui form" onSubmit={this.handleAddTransaction}>
          <h4 className="ui dividing header">Create Transaction</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input
                  autoFocus
                  type="text"
                  name="security"
                  placeholder="Security"
                  required
                  value={this.state.security}
                  onChange={this.handleSecurityChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default TransactionAdd;
