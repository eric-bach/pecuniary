import { useState, useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

import SignedInMenu from './SignedInMenu';
import SignedOutMenu from './SignedOutMenu';
import { UserContext } from '../Auth/User';

const NavBar = () => {
  const [status, setStatus] = useState(false);

  const { getSession } = useContext(UserContext);

  useEffect(() => {
    getSession().then((session: any) => {
      setStatus(true);
    });
  });

  return (
    <div>
      <Menu inverted fixed='top' style={{ position: 'sticky' }}>
        <Container>
          <Menu.Item as={Link} to='/' header>
            <img src='/favicon-32x32.png' alt='logo' />
            Pecuniary
          </Menu.Item>
          <Menu.Item as={NavLink} to='/home' name='Home' />
          <Menu.Item as={NavLink} to='/accounts' name='Accounts' />
          {status ? <SignedInMenu /> : <SignedOutMenu />}
        </Container>
      </Menu>
      <Menu inverted fixed='bottom'>
        <Container>
          <div style={{ color: 'white', paddingTop: '10px' }}>
            &copy; {new Date().getFullYear()} Pecuniary. All Rights Reserved
          </div>
        </Container>
      </Menu>
    </div>
  );
};

export default NavBar;
