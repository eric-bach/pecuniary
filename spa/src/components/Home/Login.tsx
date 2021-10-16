import { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

import UserPool from '../../UserPool';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationDetails, setAuthenticationDetails] = useState({
    authenticated: '',
    title: '',
    message: '',
  });

  const history = useHistory();

  console.log('auth', localStorage.getItem('isAuthenticated'));

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

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('accessToken', accessToken);

        //console.log('Authenticated: ', data);

        window.location.pathname = '/account';
      },
      onFailure: (err) => {
        setAuthenticationDetails({
          authenticated: 'false',
          title: 'Login Failed',
          message: 'Incorrect username and/or password',
        });
        console.error('Authentication Failed: ', err.me);
      },
      newPasswordRequired: (data) => {
        setAuthenticationDetails({
          authenticated: 'false',
          title: 'Login Failed',
          message: 'Password must be changed',
        });
        console.log('New Password Required: ', data);
        // TODO Redirect to password change page
      },
    });
  };
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 480 }}>
        <Header as='h1' color='teal' textAlign='center'>
          <Image src='/img/logo.png' />
          Pecuniary
        </Header>
        <Form size='large' onSubmit={onSubmit}>
          <Segment>
            <Header as='h3' color='blue'>
              Log into your account
            </Header>
            <div>Manage your account</div>
            <br />
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
            <Button type='submit' color='blue' fluid size='large'>
              Login
            </Button>
            <br />
            By continuing I agree to Pecuniary's <a href='#'>Terms of Service</a>.
            <br />
            <br />
            <br />
            <a href='/reset'>Forgot your password?</a>
            <br />
            <br />
            <a href='/signup'>Create new account</a>
            <br />
            <br />
          </Segment>
        </Form>
        {authenticationDetails.authenticated !== 'true' && authenticationDetails.authenticated && (
          <Message negative>
            <Message.Header>{authenticationDetails.title}</Message.Header>
            <p>{authenticationDetails.message}</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Login;
