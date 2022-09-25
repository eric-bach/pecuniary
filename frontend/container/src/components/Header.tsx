import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';

import { AuthContext, AuthIsNotSignedIn, AuthIsSignedIn } from '../contexts/authContext';

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    a: {
      textDecoration: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function Header({ onSignOut }: any) {
  const classes = useStyles();

  const authContext = useContext(AuthContext);

  const onClick = () => {
    if (onSignOut) {
      authContext.signOut();
      localStorage.clear();

      onSignOut();
    }
  };

  return (
    <React.Fragment>
      <AppBar position='static' color='default' elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h6' color='inherit' noWrap component={RouterLink} to='/'>
            App
          </Typography>
          <AuthIsSignedIn>
            <Button color='primary' variant='outlined' className={classes.link} component={RouterLink} to='/' onClick={onClick}>
              Logout
            </Button>
          </AuthIsSignedIn>
          <AuthIsNotSignedIn>
            <Button color='primary' variant='outlined' className={classes.link} component={RouterLink} to='/auth/signin' onClick={onClick}>
              Login
            </Button>
          </AuthIsNotSignedIn>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
