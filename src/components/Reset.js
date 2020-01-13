import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  createTransactionType,
  deleteTransactionType,
  deleteAccountType,
  createAccountType,
  deleteCurrencyType,
  createCurrencyType,
  deleteExchangeType,
  createExchangeType
} from "../graphql/mutations";
import {
  listTransactionTypes,
  listAccountTypes,
  listCurrencyTypes,
  listExchangeTypes
} from "../graphql/queries";

class Reset extends Component {
  state = {
    loadingClass: "",
    deleted: false,
    seeded: false
  };

  deleteData = async () => {
    this.setState({ loadingClass: "loading" });

    // Delete all existing Transactions
    // let result = await API.graphql(graphqlOperation(listTransactions));
    // result.data.listTransactions.items.map(async t => {
    //   const input = { id: t.id };
    //   await API.graphql(graphqlOperation(deleteTransaction, { input }));
    // });

    // Delete all existing Accounts
    // result = await API.graphql(graphqlOperation(listAccounts));
    // result.data.listAccounts.items.map(async t => {
    //   const input = { id: t.id };
    //   await API.graphql(graphqlOperation(deleteAccount, { input }));
    // });

    // Delete all existing Securities
    // result = await API.graphql(graphqlOperation(listSecuritys));
    // result.data.listSecuritys.items.map(async t => {
    //   const input = { id: t.id };
    //   await API.graphql(graphqlOperation(deleteSecurity, { input }));
    // });

    // Delete all existing Transaction Types
    let result = await API.graphql(graphqlOperation(listTransactionTypes));
    result.data.listTransactionTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteTransactionType, { input }));
    });

    // Delete all existing Account Types
    result = await API.graphql(graphqlOperation(listAccountTypes));
    result.data.listAccountTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteAccountType, { input }));
    });

    // Delete all existing Exchange Types
    result = await API.graphql(graphqlOperation(listExchangeTypes));
    result.data.listExchangeTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteExchangeType, { input }));
    });

    // Delete all existing Currency Types
    result = await API.graphql(graphqlOperation(listCurrencyTypes));
    result.data.listCurrencyTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteCurrencyType, { input }));
    });

    this.setState({ loadingClass: "" });
    this.setState({ deleted: true });
  };

  seedData = async () => {
    this.setState({ loadingClass: "loading" });

    // Seed base Transaction Types
    let input = { id: 1, name: "Buy", description: "Buy" };
    await API.graphql(graphqlOperation(createTransactionType, { input }));
    input = { id: 2, name: "Sell", description: "Sell" };
    await API.graphql(graphqlOperation(createTransactionType, { input }));

    // Seed base Account Types
    input = { id: 1, name: "TFSA", description: "Tax Free Savings Account" };
    await API.graphql(graphqlOperation(createAccountType, { input }));
    input = {
      id: 2,
      name: "RRSP",
      description: "Registered Retirement Savings Account"
    };
    await API.graphql(graphqlOperation(createAccountType, { input }));

    // Seed base Currency Types
    input = { id: 1, name: "CAD", description: "Canadian Dollar" };
    await API.graphql(graphqlOperation(createCurrencyType, { input }));
    input = {
      id: 2,
      name: "USD",
      description: "US Dollar"
    };
    await API.graphql(graphqlOperation(createCurrencyType, { input }));

    // List all existing Currency Types
    const response = await API.graphql(graphqlOperation(listCurrencyTypes));
    const cad = response.data.listCurrencyTypes.items.find(item => {
      return item.id === 1;
    });
    const usd = response.data.listCurrencyTypes.items.find(item => {
      return item.id === 2;
    });

    // Seed base Exchange Types
    input = {
      id: 1,
      name: "TSX",
      description: "Toronto Stock Exchange",
      exchangeTypeCurrencyTypeId: cad.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));
    input = {
      id: 2,
      name: "NYSE",
      description: "New York Stock Exchange",
      exchangeTypeCurrencyTypeId: usd.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));
    input = {
      id: 3,
      name: "NASDAQ",
      description: "NASDAQ",
      exchangeTypeCurrencyTypeId: usd.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));

    this.setState({ loadingClass: "" });
    this.setState({ seeded: true });
  };

  render() {
    return (
      <div className="ui main container" style={{ paddingTop: "20px" }}>
        <button
          className={`ui red button ${this.state.loadingClass}`}
          onClick={this.deleteData}
        >
          Delete Tables
        </button>
        <button
          className={`ui primary button ${this.state.loadingClass}`}
          onClick={this.seedData}
        >
          Populate Tables
        </button>
        {this.state.deleted && (
          <div className="ui message">
            <div className="header">Success</div>
            <p>Deleted all data from database</p>
          </div>
        )}
        {this.state.seeded && (
          <div className="ui message">
            <div className="header">Success</div>
            <p>Populated database with seed data</p>
          </div>
        )}
      </div>
    );
  }
}

export default Reset;
