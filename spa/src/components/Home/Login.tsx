import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import UserPool from '../../UserPool';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event: any) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log('onSuccess: ', data);

        var accessToken = data.getAccessToken().getJwtToken();

        console.log('accessToken: ', accessToken);
      },
      onFailure: (err) => {
        console.error('onFailure: ', err);
      },
      newPasswordRequired: (data) => {
        console.log('newPasswordRequired: ', data);
      },
    });
  };
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='/img/logo.png' /> Log-in to your account
        </Header>
        <Form size='large' onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='E-mail address'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button type='submit' color='teal' fluid size='large'>
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <a href='/signup'>Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
