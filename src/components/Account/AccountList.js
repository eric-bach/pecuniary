import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listAccounts } from "../../graphql/queries";
import "./AccountList.css";

class AccountList extends Component {
  state = {
    userId: this.props.userId,
    accounts: [], // list of accounts owned by the userId,
    isLoading: false
  };

  componentDidMount = async () => {
    this.setState({ isLoading: !this.state.isLoading });

    // TODO Write a new query to get list of accounts by user id instead of filtering after
    await API.graphql(
      graphqlOperation(listAccounts, {
        filter: {
          userId: {
            eq: this.state.userId
          }
        }
      })
    ).then(result =>
      this.setState({ accounts: result.data.listAccounts.items })
    );

    this.setState({ isLoading: !this.state.isLoading });
  };

  handleDisplayAccount = account => {
    this.props.onDisplayAccount(account);
  };

  handleEditAccount = account => {
    this.props.onEditAccount(account);
  };

  render() {
    return (
      <div className="ui middle aligned divided list">
        {this.state.isLoading ? (
          <div className="ui active centered inline loader"></div>
        ) : (
          this.state.accounts.map(account => {
            return (
              <div
                className="item content"
                key={account.id}
                style={{ padding: "10px" }}
              >
                <div
                  className="right floated item link"
                  onClick={() => this.handleEditAccount(account)}
                >
                  <i className="edit icon"></i>Edit
                </div>
                <div
                  className="header link"
                  onClick={() => this.handleDisplayAccount(account)}
                >
                  {account.name} | {account.accountType.name}
                </div>
                <div className="description">{account.description}</div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default AccountList;
