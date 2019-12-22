import React, { Component } from "react";

class Account extends Component {
  render() {
    return (
      <div className="ui main container">
        <form className="ui form">
          <h4 className="ui dividing header">Create Account</h4>
          <div className="field">
            <label>Name</label>
            <div className="two fields">
              <div className="field">
                <input type="text" name="Name" placeholder="Account Name" />
              </div>
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Type</label>
              <select className="ui fluid dropdown">
                <option value="">Account Type</option>
                <option value="TFSA">TFSA</option>
                <option value="RESP">RESP</option>
                <option value="RRSP">RRSP</option>
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

export default Account;
