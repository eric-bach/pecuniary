import { useState } from 'react';
import { Grid, Segment, Header, Form, Button, Select } from 'semantic-ui-react';

const AccountForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (event: any) => {
    event.preventDefault();

    // TODO Call AppSync to create account
    console.log('Create Account');
  };

  // TODO Call AppSync to get Account Types
  const data = [
    {
      key: '1',
      text: 'TFSA',
      value: 'TFSA',
    },
    {
      key: '2',
      text: 'RRSP',
      value: 'RRSP',
    },
  ];

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
            <Form.Input control={Select} label='Account Type' selection options={data} />
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
