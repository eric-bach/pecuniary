import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../../UserPool';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

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
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor='email'>Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)}></input>
        <label htmlFor='text'>Code</label>
        <input value={code} onChange={(event) => setCode(event.target.value)}></input>

        <button type='submit'>Verify</button>
      </form>
    </div>
  );
};

export default Verify;
