import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';
import { Form, Input, SubmitButton } from 'formik-semantic-ui-react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import UserPool from '../../UserPool';

const Signup = () => {
  const signUp = async (values: any) => {
    var attributeList = [];
    var dataEmail = {
      Name: 'email',
      Value: values.email,
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    console.log('[SIGNUP] Attribute list: ', JSON.stringify(attributeList));

    await UserPool.signUp(values.email, values.password, attributeList, [], (err, data) => {
      if (err) {
        console.error(`[SIGNUP] Error: ${JSON.stringify(err)}`);
      }

      console.log(`[SIGNUP] Data: ${JSON.stringify(data)}`);
    });

    // TODO Add user to Users group - https://bobbyhadz.com/blog/aws-cognito-add-user-to-group
    console.log('[SIGNUP] About to add user to group: ');
    // TODO Call graphql mutation

    window.location.pathname = '/verify';
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 480 }}>
        <Header as='h1' color='teal' textAlign='center'>
          <Image src='/img/logo.png' />
          Pecuniary
        </Header>
        <Formik
          initialValues={{ email: '', password: '', passwordConfirm: '' }}
          onSubmit={async (values) => {
            await signUp(values);
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
            passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
          })}
        >
          <Form size='large'>
            <Segment>
              <Header as='h3' color='blue'>
                Create new account
              </Header>
              <Input
                id='email'
                name='email'
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Email address'
                errorPrompt
              />
              <Input
                id='password'
                name='password'
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                errorPrompt
              />
              <Input
                id='passwordConfirm'
                name='passwordConfirm'
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Confirm Password'
                type='password'
                errorPrompt
              />
              <SubmitButton fluid primary>
                Sign up
              </SubmitButton>
              <br />
              By continuing I agree to Pecuniary's <a href='/service'>Terms of Service</a>.
              <br />
              <br />
            </Segment>
          </Form>
        </Formik>
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
