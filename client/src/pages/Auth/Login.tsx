import { useState, useContext } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { UserContext } from './User';

const Login = () => {
  const [message, setMessage] = useState({ visible: false, error: '' });
  const { authenticate }: any = useContext(UserContext);
  const { handleSubmit, handleChange, values, errors, handleBlur } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Please enter your Email'),
      password: Yup.string()
        .min(8, 'Password must be a minimum of 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
        )
        .required('Please enter your password'),
    }),
    onSubmit: ({ email, password }) => {
      authenticate(email, password)
        .then((data: any) => {
          console.log('[LOGIN] Authentication succeeded: ', data);

          // Re-direct to /home
          window.location.pathname = '/home';
        })
        .catch((err: any) => {
          console.error('[LOGIN] Authentication failed');
          setMessage({ visible: true, error: err });
        });
    },
  });

  return (
    <>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 480 }}>
          <Header as='h1' color='teal' textAlign='center'>
            <Image src='/img/logo.png' />
            Pecuniary
          </Header>
          <Form size='large' onSubmit={handleSubmit}>
            <Segment>
              <Header as='h3' color='blue'>
                Log into your account
              </Header>
              <div>Manage your account</div>
              <br />
              <Form.Input
                id='email'
                fluid
                icon='user'
                iconPosition='left'
                placeholder={values.email || errors.email ? errors.email : 'Email address'}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email !== undefined}
              />
              <Form.Input
                id='password'
                fluid
                icon='lock'
                iconPosition='left'
                placeholder={values.password || errors.password ? errors.password : 'Password'}
                type='password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password !== undefined}
              />
              <Button type='submit' color='blue' fluid size='large'>
                Login
              </Button>
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
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Login;
