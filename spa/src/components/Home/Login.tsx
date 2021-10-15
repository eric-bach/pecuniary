import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import UserPool from '../../UserPool';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [authenticationDetails, setAuthenticationDetails] = useState({ authenticated: '', title: '', message: '' });

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
        var accessToken = data.getAccessToken().getJwtToken();

        // setAuthenticationDetails({ authenticated: 'true', title: '', message: '' });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('accessToken', accessToken);

        console.log('Authenticated: ', data);

        history.push('/account');
      },
      onFailure: (err) => {
        // setAuthenticationDetails({
        //   authenticated: 'false',
        //   title: 'Login Failed',
        //   message: 'Incorrect username and/or password',
        // });
        //console.error('Authentication Failed: ', err.me);
      },
      newPasswordRequired: (data) => {
        // setAuthenticationDetails({
        //   authenticated: 'false',
        //   title: 'Login Failed',
        //   message: 'Password must be changed',
        // });
        //console.log('New Password Required: ', data);
        // TODO Redirect to password change page
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
        {/* {authenticationDetails.authenticated !== 'true' && authenticationDetails.authenticated && (
          <Message negative>
            <Message.Header>Login Failed</Message.Header>
            <p>Incorrect username or password</p>
          </Message>
        )} */}
        <Message>
          New to us? <a href='/signup'>Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
