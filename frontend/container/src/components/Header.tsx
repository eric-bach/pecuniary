import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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
        <Toolbar>
          <MonetizationOnIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            color='inherit'
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 12,
              display: { xs: 'none', md: 'flex' },
              textDecoration: 'none',
            }}
          >
            Pecuniary
          </Typography>
          <AuthIsSignedIn>
            <Typography
              variant='h6'
              color='inherit'
              noWrap
              component={RouterLink}
              to='/app'
              sx={{
                mr: 3,
                display: { xs: 'none', md: 'flex' },
                textDecoration: 'none',
              }}
            >
              Dashboard
            </Typography>
            <Typography
              variant='h6'
              color='inherit'
              noWrap
              component={RouterLink}
              to='/app/accounts'
              sx={{
                mr: 3,
                display: { xs: 'none', md: 'flex' },
                textDecoration: 'none',
              }}
            >
              Accounts
            </Typography>
          </AuthIsSignedIn>

          <AuthIsSignedIn>
            <Button color='primary' variant='outlined' component={RouterLink} to='/' onClick={onClick} sx={{ marginLeft: 'auto' }}>
              Logout
            </Button>
          </AuthIsSignedIn>
          <AuthIsNotSignedIn>
            <Button
              color='primary'
              variant='outlined'
              component={RouterLink}
              to='/auth/signin'
              onClick={onClick}
              sx={{ marginLeft: 'auto' }}
            >
              Login
            </Button>
          </AuthIsNotSignedIn>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
