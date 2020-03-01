import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Grid, Segment, Header, Form, Button } from "semantic-ui-react";
import { combineValidators, composeValidators, isRequired, matchesPattern } from "revalidate";

import { fetchTransactionTypes, createTransaction } from "../../domain/transaction/actions";
import TextInput from "../../common/Form/TextInput";
import SelectInput from "../../common/Form/SelectInput";
import DateInput from "../../common/Form/DateInput";
import AccountSummary from "../Account/AccountSummary";

const validate = combineValidators({
  "transactionType.id": isRequired({ message: "The transaction type is required" }),
  date: isRequired({ message: "Please select the transaction date" }),
  symbol: composeValidators(
    isRequired({ message: "The security symbol is required" }),
    matchesPattern(/^[a-zA-Z]+\.[a-zA-Z]+$|^[a-zA-Z]+$/)({ message: "The security symbol is invalid" })
  )(),
  shares: composeValidators(
    isRequired({ message: "The number of shares is required" }),
    matchesPattern(/^(\d{1,3}(\\,\d{3})*|(\d+))(\.\d+)?$/)({ message: "The price per shares is invalid" })
  )(),
  price: composeValidators(
    isRequired({ message: "The price per share is required" }),
    matchesPattern(/^(\d{1,3}(\\,\d{3})*|(\d+))(\.\d{0,2})?$/)({ message: "The price per shares is invalid" })
  )(),
  commission: composeValidators(
    isRequired({ message: "The commission amount is required" }),
    matchesPattern(/^(\d{1,3}(\\,\d{3})*|(\d+))(\.\d{0,2})?$/)({ message: "The commission amount is invalid" })
  )()
});

class TransactionForm extends Component {
  componentDidMount() {
    this.props.fetchTransactionTypes();
  }

  onFormSubmit = values => {
    if (this.props.initialValues.id) {
      //this.props.updateAccount(values);
    } else {
      const newTransaction = {
        ...values,
        account: this.props.location.state.account
      };

      this.props.createTransaction(newTransaction);
    }

    this.props.history.push("/accounts");
  };

  render() {
    const account = this.props.location.state.account;
    const { history, transactionTypes } = this.props;

    let transactionTypeItems = transactionTypes.map(transactionType => ({
      key: transactionType.id,
      text: transactionType.name,
      value: transactionType.id
    }));

    return (
      <>
        <h2>Account</h2>
        <AccountSummary key={account.aggregateId} account={account} displayButtons={false} data-test='account-label' />
        <div>
          <h2>Transaction Form</h2>
          <Grid>
            <Grid.Column width={10}>
              <Segment>
                <Header sub color='teal' content='Transaction Details' />
                <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)} autoComplete='off'>
                  <Field
                    name='transactionType.id'
                    type='text'
                    component={SelectInput}
                    options={transactionTypeItems}
                    placeholder='What transaction type is this'
                    dataTest='transaction-type-selector'
                  ></Field>
                  <Field
                    name='date'
                    dateFormat='yyyy-LL-dd'
                    component={DateInput}
                    placeholder='Transaction date'
                    dataTest='transaction-date'
                  ></Field>
                  <Field
                    name='symbol'
                    type='text'
                    component={TextInput}
                    placeholder='Security symbol'
                    dataTest='symbol-input'
                  />
                  <Field
                    name='shares'
                    type='text'
                    component={TextInput}
                    placeholder='Number of shares'
                    dataTest='shares-input'
                  />
                  <Field
                    name='price'
                    type='text'
                    component={TextInput}
                    placeholder='Price per share'
                    dataTest='price-input'
                  />
                  <Field
                    name='commission'
                    type='text'
                    component={TextInput}
                    placeholder='Commission of trade'
                    dataTest='commission-input'
                  />
                  <Button positive type='submit' data-test='submit-transaction-button'>
                    Submit
                  </Button>
                  <Button
                    type='button'
                    onClick={() => history.push("/accounts")}
                    // TODO push to account view
                    //onClick={() => history.push(`/accounts/view/${account.id}`, { state: account })}
                    data-test='cancel-submit-transaction-button'
                  >
                    Cancel
                  </Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const transactionId = ownProps.match.params.id;
  let transaction = {};

  if (transactionId && state.transaction.transactions.length > 0) {
    transaction = state.transaction.transactions(t => t.id === transactionId)[0];
  } else {
    // Default new transaction to today's date
    transaction = { date: new Date() };
  }

  return {
    initialValues: transaction,
    transactionTypes: state.transaction.transactionTypes
  };
};

const actions = {
  fetchTransactionTypes,
  createTransaction
};

export default connect(mapStateToProps, actions)(reduxForm({ form: "transactionForm", validate })(TransactionForm));
