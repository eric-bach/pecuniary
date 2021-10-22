import { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import UserPool from '../../UserPool';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifyDetails] = useState({ state: '', title: '', message: '' });

  const onSubmit = (event: any) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    user.confirmRegistration(code, true, function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }

      console.log('call result: ' + result);

      window.location.pathname = '/account';
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
              Verify new account
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
              placeholder='Verification Code'
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button type='submit' color='blue' fluid size='large'>
              Verify
            </Button>
          </Segment>
        </Form>
        {verifyDetails.state === 'passwordConfirm' && (
          <Message negative>
            <Message.Header>{verifyDetails.title}</Message.Header>
            <p>{verifyDetails.message}</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Verify;
