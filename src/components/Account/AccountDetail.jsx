import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Grid, Segment, Header, Form, Button } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";

import { updateAccount } from "../../domain/account/actions";
import TextInput from "../../common/Form/TextInput";
import SelectInput from "../../common/Form/SelectInput";

const validate = combineValidators({
  name: isRequired({ message: "The account name is required" }),
  type: isRequired({ message: "Please select an account type" }),
  description: isRequired({ message: "The account description is required" })
});

// TODO Get this from DynamoDB
const accountTypes = [
  { key: "1", text: "TFSA", value: "1" },
  { key: "2", text: "RRSP", value: "2" }
];

class AccountDetail extends Component {
  onFormSubmit = values => {
    if (this.props.initialValues.id) {
      this.props.updateAccount(values);
      this.props.history.push("/accounts");
    } else {
      console.log("TODO: Create new Account");
    }
  };

  render() {
    const { history, initialValues } = this.props;

    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color='teal' content='Account Details' />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)} autoComplete='off'>
              <Field name='name' type='text' component={TextInput} placeholder='Give your account a name'></Field>
              <Field
                name='accountType.id'
                type='text'
                component={SelectInput}
                options={accountTypes}
                placeholder='What account type is this'
              ></Field>
              <Field
                name='description'
                type='text'
                component={TextInput}
                placeholder='Give your account a description'
              ></Field>

              <Button positive type='submit'>
                Submit
              </Button>
              <Button type='button' onClick={() => history.push("/accounts")}>
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

  console.log(state.accounts);
  if (accountId && state.accounts.accounts.length > 0) {
    account = state.accounts.accounts.filter(account => account.id === accountId)[0];
  }

  return {
    initialValues: account
  };
};

const actions = {
  updateAccount
};

export default connect(mapStateToProps, actions)(reduxForm({ form: "accountForm", validate })(AccountDetail));
