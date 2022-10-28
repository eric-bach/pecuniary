import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Dashboard() {
  return (
    <Container>
      <Typography variant='h4' align='left' color='textPrimary' gutterBottom>
        Dashboard
      </Typography>
      <Link to='/app/accounts'>
        <Button variant='contained' color='primary'>
          Accounts
        </Button>
      </Link>
    </Container>
  );
}
