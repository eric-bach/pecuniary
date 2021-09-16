import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import React, { useState } from 'react';
import UserPool from '../../UserPool';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event: any) => {
    event.preventDefault();

    var attributeList = [];
    var dataEmail = {
      Name: 'email',
      Value: email,
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    console.log(JSON.stringify(attributeList));

    UserPool.signUp(email, password, attributeList, [], (err, data) => {
      if (err) {
        console.error(`Error: ${JSON.stringify(err)}`);
      }
      console.log(`Data: ${JSON.stringify(data)}`);
    });

    // TODO Add user to Users group
    // https://bobbyhadz.com/blog/aws-cognito-add-user-to-group
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor='email'>Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)}></input>
        <label htmlFor='password'>Password</label>
        <input value={password} onChange={(event) => setPassword(event.target.value)}></input>

        <button type='submit'>Signup</button>
      </form>
    </div>
  );
};

export default Signup;
