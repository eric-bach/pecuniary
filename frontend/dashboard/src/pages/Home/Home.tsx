import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <div>
      Home
      <Link to='/app/accountslist'>
        <Button variant='contained' color='primary'>
          Accounts
        </Button>
      </Link>
    </div>
  );
}
