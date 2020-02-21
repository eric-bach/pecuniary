import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Grid, Segment, Header, Form, Button } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";

import { fetchTransactionTypes, createTransaction } from "../../domain/transaction/actions";
import TextInput from "../../common/Form/TextInput";
import SelectInput from "../../common/Form/SelectInput";
import DateInput from "../../common/Form/DateInput";
import AccountSummary from "../Account/AccountSummary";

const validate = combineValidators({
  "transactionType.id": isRequired({ message: "The transaction type is required" }),
  date: isRequired({ message: "Please select the transaction date" }),
  symbol: isRequired({ message: "The security symbol is required" }),
  shares: isRequired({ message: "The number of shares is required" }),
  price: isRequired({ message: "The price per share is required" }),
  commission: isRequired({ message: "The commission amount is required" })
});

class TransactionForm extends Component {
  componentDidMount() {
    this.props.fetchTransactionTypes();
  }

  onFormSubmit = values => {
    // console.log("Create Transaction: ", values);
    // console.log("Account: ", this.props.location.state.account);

    if (this.props.initialValues.id) {
      //this.props.updateAccount(values);
    } else {
      const uuidv4 = require("uuid/v4");
      const newTransaction = {
        ...values,
        aggregateId: uuidv4(),
        account: {
          id: this.props.location.state.account.id
        }
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
                  ></Field>
                  <Field
                    name='date'
                    dateFormat='yyyy-LL-dd'
                    component={DateInput}
                    placeholder='Transaction date'
                  ></Field>

                  <Field name='symbol' type='text' component={TextInput} placeholder='Security symbol' />
                  <Field name='shares' type='text' component={TextInput} placeholder='Number of shares' />
                  <Field name='price' type='text' component={TextInput} placeholder='Price per share' />
                  <Field name='commission' type='text' component={TextInput} placeholder='Commission of trade' />
                  <Button positive type='submit'>
                    Submit
                  </Button>
                  <Button
                    type='button'
                    onClick={() => history.push("/accounts")}
                    // TODO push to account view
                    //onClick={() => history.push(`/accounts/view/${account.id}`, { state: account })}
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
  const accountId = ownProps.match.params.id;

  let account = {};

  if (accountId && state.accounts.accounts.length > 0) {
    account = state.accounts.accounts.filter(account => account.id === accountId)[0];
  }

  return {
    initialValues: account,
    transactionTypes: state.transaction.transactionTypes
  };
};

const actions = {
  fetchTransactionTypes,
  createTransaction
};

export default connect(mapStateToProps, actions)(reduxForm({ form: "transactionForm", validate })(TransactionForm));
