import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './User';

const Status = () => {
  const [status, setStatus] = useState(false);

  const { getSession, logout } = useContext(UserContext);

  useEffect(() => {
    getSession().then((session: any) => {
      console.log('Session: ', session);
      setStatus(true);
    });
  }, []);

  return <div style={{ fontSize: '24px' }}>{status ? <button onClick={logout}>Logout</button> : 'Please login'}</div>;
};

export default Status;
