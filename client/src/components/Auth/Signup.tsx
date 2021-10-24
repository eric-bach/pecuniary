import { useState } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

import UserPool from '../../UserPool';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [signUpDetails, setSignUpDetails] = useState({ state: '', title: '', message: '' });

  const onSubmit = (event: any) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setSignUpDetails({
        state: 'passwordConfirm',
        title: 'Sign up Failed',
        message: 'Passwords do not match',
      });
    }

    var attributeList = [];
    var dataEmail = {
      Name: 'email',
      Value: email,
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    console.log('[SIGNUP] Attribute list: ', JSON.stringify(attributeList));

    UserPool.signUp(email, password, attributeList, [], (err, data) => {
      if (err) {
        console.error(`[SIGNUP] Error: ${JSON.stringify(err)}`);
      }

      setSignUpDetails({ state: 'signedUp', title: '', message: '' });

      console.log(`[SIGNUP] Data: ${JSON.stringify(data)}`);
    });

    // TODO Add user to Users group
    // https://bobbyhadz.com/blog/aws-cognito-add-user-to-group

    window.location.pathname = '/verify';
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
              Create new account
            </Header>
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
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Confirm Password'
              type='password'
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
            <Button type='submit' color='blue' fluid size='large'>
              Sign up
            </Button>
            <br />
            By continuing I agree to Pecuniary's <a href='/service'>Terms of Service</a>.
            <br />
            <br />
          </Segment>
        </Form>
        {signUpDetails.state === 'passwordConfirm' && (
          <Message negative>
            <Message.Header>{signUpDetails.title}</Message.Header>
            <p>{signUpDetails.message}</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
