import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SignedOutMenu = () => {
  return (
    <Menu.Item position='right'>
      <Menu.Item as={NavLink} to='/login' name='Login' />
    </Menu.Item>
  );
};

export default SignedOutMenu;
