import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { AuthContext, AuthIsNotSignedIn, AuthIsSignedIn } from '../contexts/authContext';

export default function Header({ onSignOut }: any) {
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
      <AppBar
        position='static'
        color='default'
        elevation={0}
        sx={{
          borderBottom: '1px solid',
        }}
      >
        <Toolbar
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' color='inherit' noWrap component={RouterLink} to='/'>
            App
          </Typography>
          <AuthIsSignedIn>
            <Button
              color='primary'
              variant='outlined'
              sx={{
                mt: 1,
                mb: 1,
                ml: 1.5,
                mr: 1.5,
              }}
              component={RouterLink}
              to='/'
              onClick={onClick}
            >
              Logout
            </Button>
          </AuthIsSignedIn>
          <AuthIsNotSignedIn>
            <Button
              color='primary'
              variant='outlined'
              sx={{
                mt: 1,
                mb: 1,
                ml: 1.5,
                mr: 1.5,
              }}
              component={RouterLink}
              to='/auth/signin'
              onClick={onClick}
            >
              Login
            </Button>
          </AuthIsNotSignedIn>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
