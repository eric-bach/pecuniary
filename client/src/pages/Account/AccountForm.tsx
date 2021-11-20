import { useState, useContext, useEffect } from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import { Form, Input, SubmitButton, Select } from 'formik-semantic-ui-react';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import { LIST_ACCOUNT_TYPES, CREATE_ACCOUNT, UPDATE_ACCOUNT } from './graphql/graphql';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { SelectList, SelectListItem } from '../types/SelectList';
import { AccountProps, CreateAccountInput, UpdateAccountInput } from './types/Account';

const AccountForm = (props: AccountProps) => {
  const [account] = useState(props.location.state ? props.location.state.account : undefined);
  const [username, setUsername] = useState('');
  const { data: accountTypes, error: accountTypesError, loading: accountTypesLoading } = useQuery(LIST_ACCOUNT_TYPES);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
  const [updateAccountMutation] = useMutation(UPDATE_ACCOUNT);
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    account
      ? console.log(`[ACCOUNT FORM] Aggregate Id ${account.aggregateId} exists. Edit Account mode enabled`)
      : console.log('[ACCOUNT FORM] Aggregate Id does not exist.  Create Account mode enabled');

    // Get the logged in username
    getSession().then((session: CognitoUserSession) => {
      setUsername(session.idToken.payload.email);
    });
  }, [account, getSession]);

  // TODO Improve this Error page
  if (accountTypesError) return 'Error!';
  if (accountTypesLoading) return <Loading />;

  const accountTypesList: SelectList[] = [];
  accountTypes.listAccountTypes.map((d: SelectListItem) => {
    accountTypesList.push({ key: d.id, text: d.name, value: d.description });
    return true;
  });

  const createUpdateAccount = (name: string, accountType: string, description: string) => {
    const selectedAccountType: SelectList = accountTypesList.find((a) => a.value === accountType) ?? {
      key: '',
      text: '',
      value: '',
    };

    if (!account) {
      console.log('[ACCOUNT FORM] Creating Account...');

      const params: CreateAccountInput = {
        createAccountInput: {
          aggregateId: uuidv4(),
          name: 'AccountCreatedEvent',
          data: `{"name":"${name}","description":"${description}","bookValue":0,"marketValue":0,"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
          version: 1,
          userId: `${username}`,
          createdAt: new Date(),
        },
      };

      createAccountMutation({
        variables: params,
      })
        .then((res) => {
          console.log('[ACCOUNT FORM] Account created successfully');

          setTimeout(() => {
            window.location.pathname = '/accounts';
          }, 1000);
        })
        .catch((err) => {
          console.error('[ACCOUNT FORM] Error occurred creating account');
          console.error(err);
        });
    } else {
      console.log('[ACCOUNT FORM] Updating Account...');

      const params: UpdateAccountInput = {
        updateAccountInput: {
          aggregateId: account.aggregateId,
          name: 'AccountUpdatedEvent',
          data: `{"id":"${account.id}","name":"${name}","description":"${description}","bookValue":${account.bookValue},"marketValue":${account.marketValue},"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
          version: account.version + 1,
          userId: `${username}`,
          createdAt: new Date(),
        },
      };

      console.log('[ACCOUNT FORM] Updating Account with values: ', params);

      updateAccountMutation({
        variables: params,
      })
        .then((res) => {
          console.log('[ACCOUNT FORM] Account updated successfully');

          window.location.pathname = '/accounts';
        })
        .catch((err) => {
          console.error('[ACCOUNT FORM] Error occurred updating account');
          console.error(err);
        });
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>Account</h2>
        <Segment>
          <Header sub color='teal' content='Account Details' />
          <Formik
            enableReinitialize
            initialValues={{
              name: account ? account.name : '',
              accountType: account ? account.accountType.description : '',
              description: account ? account.description : '',
            }}
            onSubmit={(values, actions) => {
              createUpdateAccount(values.name, values.accountType, values.description);
              actions.setSubmitting(false);
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Please enter an Account name'),
              accountType: Yup.string().required('Please select an Account type'),
              description: Yup.string().required('Please enter an Account description'),
            })}
          >
            <Form size='large'>
              <Input
                id='name'
                fluid
                icon='user'
                iconPosition='left'
                name='name'
                label='Account name'
                placeholder='Account name'
                errorPrompt
              />
              <Select
                id='accountType'
                name='accountType'
                label='Account Type'
                options={accountTypesList}
                placeholder='Select an account type'
                selection
                errorPrompt
              />
              <Input
                id='description'
                fluid
                icon='lock'
                iconPosition='left'
                name='description'
                label='Account description'
                placeholder='Account description'
                errorPrompt
              />
              <SubmitButton fluid primary>
                Submit
              </SubmitButton>
            </Form>
          </Formik>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default AccountForm;
