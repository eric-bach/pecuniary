import { useState, useContext } from 'react';
import { Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Form, Input, SubmitButton } from 'formik-semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { UserContext } from './User';

const Login = () => {
  const [message, setMessage] = useState({ visible: false, error: '' });
  const { authenticate }: any = useContext(UserContext);

  return (
    <>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 480 }}>
          <Header as='h1' color='teal' textAlign='center'>
            <Image src='/img/logo.png' />
            Pecuniary
          </Header>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={(values, actions) => {
              authenticate(values.email, values.password)
                .then((data: any) => {
                  console.log('[LOGIN] Authentication succeeded: ', data);

                  // Re-direct to /home
                  window.location.pathname = '/home';
                })
                .catch((err: any) => {
                  console.error('[LOGIN] Authentication failed');
                  setMessage({ visible: true, error: err });
                });

              actions.setSubmitting(false);
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required('Please enter your Email'),
              password: Yup.string()
                .min(8, 'Password must be a minimum of 8 characters')
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,64})/,
                  'Password must contain at least one uppercase, one lowercase, one number and one special character'
                )
                .required('Please enter your password'),
            })}
          >
            <Form size='large'>
              <Segment>
                <Header as='h3' color='blue'>
                  Log into your account
                </Header>
                <div>Manage your account</div>
                <br />
                <Input
                  id='email'
                  fluid
                  icon='user'
                  iconPosition='left'
                  name='email'
                  placeholder='Email address'
                  errorPrompt
                />
                <Input
                  id='password'
                  name='password'
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Enter Password'
                  type='password'
                  errorPrompt
                />
                <SubmitButton fluid primary>
                  Login
                </SubmitButton>
                {message.visible && <Message negative header='Authentication failed' content={message.error} />}
                <br />
                By continuing I agree to Pecuniary's <a href='/service'>Terms of Service</a>.
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
          </Formik>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Login;
