import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Grid, Segment, Header, Form, Button } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";

import { createAccount, updateAccount } from "../../domain/account/actions";
import TextInput from "../../common/Form/TextInput";
import SelectInput from "../../common/Form/SelectInput";

const validate = combineValidators({
  name: isRequired({ message: "The account name is required" }),
  "accountType.id": isRequired({ message: "Please select an account type" }),
  description: isRequired({ message: "The account description is required" })
});

class AccountForm extends Component {
  onFormSubmit = values => {
    if (this.props.initialValues.id) {
      this.props.updateAccount(values);
    } else {
      const uuidv4 = require("uuid/v4");
      const newAccount = {
        ...values,
        aggregateId: uuidv4()
      };

      this.props.createAccount(newAccount);
    }

    this.props.history.push("/accounts");
  };

  render() {
    const { history, accountTypes } = this.props;

    let accountTypeItems = accountTypes.map(accountType => ({
      key: accountType.id,
      text: accountType.name,
      value: accountType.id
    }));

    return (
      <Grid>
        <Grid.Column width={10}>
          <h2>Account</h2>
          <Segment>
            <Header sub color='teal' content='Account Details' />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)} autoComplete='off'>
              <Field
                name='name'
                type='text'
                component={TextInput}
                placeholder='Give your account a name'
                dataTest='account-name-input'
              ></Field>
              <Field
                name='accountType.id'
                type='text'
                component={SelectInput}
                options={accountTypeItems}
                placeholder='What account type is this'
                dataTest='account-type-selector'
              ></Field>
              <Field
                name='description'
                type='text'
                component={TextInput}
                placeholder='Give your account a description'
                dataTest='account-description-input'
              ></Field>

              <Button positive type='submit' data-test='submit-account-button'>
                Submit
              </Button>
              <Button type='button' onClick={() => history.push("/accounts")} data-test='cancel-submit-account-button'>
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
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
    accountTypes: state.accounts.accountTypes
  };
};

const actions = {
  createAccount,
  updateAccount
};

export default connect(mapStateToProps, actions)(reduxForm({ form: "accountForm", validate })(AccountForm));
