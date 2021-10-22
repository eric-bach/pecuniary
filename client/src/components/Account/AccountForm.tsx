import { useState, useContext, useEffect } from 'react';
import { Grid, Segment, Header, Form, Button, Select } from 'semantic-ui-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../Auth/User';

const getAccountByAggregateId = gql`
  query GetAccountByAggregateId($aggregateId: ID!) {
    getAccountByAggregateId(aggregateId: $aggregateId) {
      id
      aggregateId
      name
      description
      version
      bookValue
      marketValue
      accountType {
        id
        name
        description
      }
    }
  }
`;

const listAccountTypes = gql`
  query ListAccountTypes {
    listAccountTypes {
      id
      name
      description
    }
  }
`;

const createAccount = gql`
  mutation CreateAccount($createAccountInput: CreateEventInput!) {
    createEvent(event: $createAccountInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const updateAccount = gql`
  mutation UpdateAccount($updateAccountInput: CreateEventInput!) {
    createEvent(event: $updateAccountInput) {
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const AccountForm = (props: any) => {
  const [aggregateId] = useState(props.match.params.id !== undefined ? props.match.params.id : '');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');

  // Flag to indicate useEffect() has completed loading
  const [loaded, setLoaded] = useState(false);

  const { data: accountTypes, error: accountTypesError, loading: accountTypesLoading } = useQuery(listAccountTypes);
  const {
    data: account,
    error: accountError,
    loading: accountLoading,
  } = useQuery(getAccountByAggregateId, { variables: { aggregateId: aggregateId } });

  const [createAccountMutation] = useMutation(createAccount);
  const [updateAccountMutation] = useMutation(updateAccount);

  const { getSession } = useContext(UserContext);

  useEffect(() => {
    aggregateId
      ? console.log(`[ACCOUNT FORM] Aggregate Id ${aggregateId} exists. Edit Account mode enabled`)
      : console.log('[ACCOUNT FORM] Aggregate Id does not exist.  Create Account mode enabled');

    // Get the logged in username
    getSession().then((session: any) => {
      setUsername(session.idToken.payload.email);
    });
  });

  if (accountTypesError || accountError) return 'Error!'; // You probably want to do more here!
  if (accountTypesLoading || accountLoading) return 'loading...'; // You can also show a spinner here.

  // Get the account after everything loads
  if (!loaded && account && account.getAccountByAggregateId) {
    setName(account.getAccountByAggregateId.name);
    setAccountType(account.getAccountByAggregateId.accountType.description);
    setDescription(account.getAccountByAggregateId.description);
    setLoaded(true);
  }

  const onSubmit = (event: any) => {
    event.preventDefault();

    if (!props.match.params.id) {
      console.log('[ACCOUNT FORM] Creating Account...');
      const selectedAccountType = accountTypesList.find((a) => a.value === accountType);

      const params = {
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

          window.location.pathname = '/accounts';
        })
        .catch((err) => {
          console.error('[ACCOUNT FORM] Error occurred creating account');
          console.error(err);
        });
    } else {
      console.log('[ACCOUNT FORM] Updating Account...');
      const selectedAccountType = accountTypesList.find((a) => a.value === accountType);

      const params = {
        updateAccountInput: {
          aggregateId: account.getAccountByAggregateId.aggregateId,
          name: 'AccountUpdatedEvent',
          data: `{"id":"${account.getAccountByAggregateId.id}","name":"${name}","description":"${description}","bookValue":${account.getAccountByAggregateId.bookValue},"marketValue":${account.getAccountByAggregateId.marketValue},"accountType":{"id":"${selectedAccountType.key}","name":"${selectedAccountType.text}","description":"${selectedAccountType.value}"}}`,
          version: account.getAccountByAggregateId.version + 1,
          userId: `${username}`,
          createdAt: new Date(),
        },
      };

      console.log('[ACCOUNT FORM] Updaing Account with values: ', params);

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

  // TODO Set AccountTypes type from any
  const accountTypesList: any[] = [];
  accountTypes.listAccountTypes.map((d: any) => {
    accountTypesList.push({ key: d.id, text: d.name, value: d.description });
  });

  const onChange = (event: any, result: any) => {
    const { value } = result;
    console.log('Selected value: ', value);
    setAccountType(value);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <h2>Account</h2>
        <Segment>
          <Header sub color='teal' content='Account Details' />
          <Form size='large' onSubmit={onSubmit}>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              label='Account Name'
              placeholder='Account name'
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Form.Input
              control={Select}
              label='Account Type'
              placeholder='Account Type'
              selection
              options={accountTypesList}
              value={accountType}
              onChange={onChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              label='Account Description'
              placeholder='Account description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <Button positive type='submit' data-test='submit-account-button'>
              Submit
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default AccountForm;
