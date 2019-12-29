import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "aws-amplify-react";
import Accounts from "./components/Accounts";
import TransactionAdd from "./components/TransactionAdd";
import Navbar from "./components/NavBar";
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
} from "./graphql/mutations";
import {
  listTransactionTypes,
  listAccountTypes,
  listCurrencyTypes,
  listExchangeTypes
} from "./graphql/queries";

class App extends React.Component {
  componentDidMount = async () => {
    this.seed();
  };

  seedTransactionTypes = async () => {
    // Delete all existing Transaction Types
    const result = await API.graphql(graphqlOperation(listTransactionTypes));
    result.data.listTransactionTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteTransactionType, { input }));
    });

    // Seed base Transaction Types
    let input = { name: "Buy", description: "Buy" };
    await API.graphql(graphqlOperation(createTransactionType, { input }));
    input = { name: "Sell", description: "Sell" };
    await API.graphql(graphqlOperation(createTransactionType, { input }));
  };

  seedAccountTypes = async () => {
    // Delete all existing Account Types
    const result = await API.graphql(graphqlOperation(listAccountTypes));
    result.data.listAccountTypes.items.map(async t => {
      const input = { id: t.id };
      await API.graphql(graphqlOperation(deleteAccountType, { input }));
    });

    // Seed base Account Types
    let input = { name: "TFSA", description: "Tax Free Savings Account" };
    await API.graphql(graphqlOperation(createAccountType, { input }));
    input = {
      name: "RRSP",
      description: "Registered Retirement Savings Account"
    };
    await API.graphql(graphqlOperation(createAccountType, { input }));
  };

  seedExchangeAndCurrencyTypes = async () => {
    // Delete all existing Exchange Types
    let result = await API.graphql(graphqlOperation(listExchangeTypes));
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

    // Seed base Currency Types
    let input = { name: "CAD", description: "Canadian Dollar" };
    await API.graphql(graphqlOperation(createCurrencyType, { input }));
    input = {
      name: "USD",
      description: "US Dollar"
    };
    await API.graphql(graphqlOperation(createCurrencyType, { input }));

    // List all existing Currency Types
    const response = await API.graphql(graphqlOperation(listCurrencyTypes));
    const cad = response.data.listCurrencyTypes.items.find(item => {
      return item.name === "CAD";
    });
    const usd = response.data.listCurrencyTypes.items.find(item => {
      return item.name === "USD";
    });

    // Seed base Exchange Types
    input = {
      name: "TSX",
      description: "Toronto Stock Exchange",
      exchangeTypeCurrencyTypeId: cad.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));
    input = {
      name: "NYSE",
      description: "New York Stock Exchange",
      exchangeTypeCurrencyTypeId: usd.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));
    input = {
      name: "NASDAQ",
      description: "NASDAQ",
      exchangeTypeCurrencyTypeId: usd.id
    };
    await API.graphql(graphqlOperation(createExchangeType, { input }));
  };

  seed = async () => {
    this.seedTransactionTypes();
    this.seedAccountTypes();
    this.seedExchangeAndCurrencyTypes();
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/accounts" component={Accounts} />
            <Route exact path="/transactions/new" component={TransactionAdd} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: false });
