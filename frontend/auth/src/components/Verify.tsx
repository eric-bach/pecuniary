import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import Container from '@mui/material/Container';

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    a: {
      textDecoration: 'none',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Verify({ onVerify }: any) {
  const classes = useStyles();

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Typography component='h2' variant='h5'>
          A confirmation email has been sent to your email. Please verify the email from the link before signing in.
        </Typography>
        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit} onClick={() => onVerify()}>
          Return to Sign In
        </Button>
      </div>
    </Container>
  );
}
