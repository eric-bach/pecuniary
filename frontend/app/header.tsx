import { useState } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import PaidIcon from '@mui/icons-material/Paid';

import { Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

const pages: string[] = ['Dashboard', 'Account', 'Integrations'];
const settings: string[] = ['My Profile', 'My Bookings', 'Logout'];

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: '#ccc',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function Header() {
  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e: any) => {
    setAnchorElNav(null);

    // if (e.target.textContent === 'Account') {
    //   redirect('/dashboard');
    // }
  };

  const handleCloseUserMenu = async (e: any) => {
    setAnchorElUser(null);

    if (e.target.textContent === 'My Profile') {
      //   navigate('/user/profile');
    } else if (e.target.textContent === 'My Bookings') {
      //   navigate('/user/bookings');
    } else if (e.target.textContent === 'Logout') {
      Auth.signOut({ global: true });
      fetcher.submit({}, { method: 'post' });
    }
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* <PaidIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Pecuniary
          </Typography>
          {user && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                {/* <MenuIcon /> */}
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={(e) => handleCloseNavMenu(e)}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages?.map((page) => (
                  <Link
                    key={page}
                    to={page.toLocaleLowerCase()}
                    style={{ margin: 6, color: 'white', display: 'block', textDecoration: 'none' }}
                  >
                    {page}
                  </Link>
                ))}
              </Menu>
            </Box>
          )}
          {/* <PaidIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Pecuniary
          </Typography>
          {user && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  to={page.toLocaleLowerCase()}
                  style={{ margin: 6, color: 'white', display: 'block', textDecoration: 'none' }}
                >
                  {page}
                </Link>
              ))}
            </Box>
          )}

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar {...stringAvatar(`${user.attributes?.given_name} ${user.attributes?.family_name}`)} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={(e) => handleCloseUserMenu(e)}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={(e) => handleCloseUserMenu(e)}>
                    <Typography textAlign='center'>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Link to='/login' style={{ margin: 6, color: 'white', display: 'block', textDecoration: 'none' }}>
              Login
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
