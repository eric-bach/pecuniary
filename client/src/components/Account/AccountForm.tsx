import { useState, useContext, useEffect } from 'react';
import { Grid, Segment, Header, Form, Button, Select } from 'semantic-ui-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../Auth/User';

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

const AccountForm = () => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const { data, error, loading } = useQuery(listAccountTypes);
  const [createAccountMutation] = useMutation(createAccount);
  const { getSession } = useContext(UserContext);

  // Get the logged in username
  useEffect(() => {
    getSession().then((session: any) => {
      setUsername(session.idToken.payload.email);
      console.log('Username: ', session.idToken.payload.email);
    });
  }, []);

  if (error) return 'Error!'; // You probably want to do more here!
  if (loading) return 'loading...'; // You can also show a spinner here.

  const onSubmit = (event: any) => {
    event.preventDefault();

    console.log('CREATE ACCOUNT');
    const selectedAccountType = accountTypes.find((a) => a.value === accountType);

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
        console.log('Account created successfully');

        window.location.pathname = '/accounts';
      })
      .catch((err) => {
        console.error('Error occurred creating account');
        console.error(err);
      });
  };

  // TODO Set AccountTypes type from any
  const accountTypes: any[] = [];
  data.listAccountTypes.map((d: any) => {
    accountTypes.push({ key: d.id, text: d.name, value: d.description });
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
              options={accountTypes}
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
