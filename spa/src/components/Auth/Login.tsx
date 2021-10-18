import { useState, useContext } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

import { UserContext } from './User';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticationDetails, setAuthenticationDetails] = useState({
    authenticated: '',
    title: '',
    message: '',
  });

  const { authenticate }: any = useContext(UserContext);

  const onSubmit = (event: any) => {
    event.preventDefault();

    authenticate(email, password)
      .then((data: any) => {
        console.log('Authentication succeeded: ', data);

        // Re-direct to /home
        window.location.pathname = '/home';
      })
      .catch((err: any) => {
        console.error('Authentication failed: ', err);
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
