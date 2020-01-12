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
      <>
        {this.state.isLoading ? (
          <div className="ui active centered inline loader"></div>
        ) : (
          <div className="ui divided selection list">
            {this.state.accounts.map(account => {
              return (
                <div
                  className="item"
                  key={account.id}
                  data-test="account-label"
                  onClick={() => this.handleDisplayAccount(account)}
                >
                  <div className="header">
                    <div className={`ui horizontal red label`}>
                      {account.accountType.name}
                    </div>
                    {account.name}
                  </div>
                  <div className="content">
                    {/* <div
                      className="right floated item link"
                      onClick={() => this.handleEditAccount(account)}
                    >
                      <i className="edit icon"></i>Edit
                    </div> */}

                    <div>{account.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}

export default AccountList;
