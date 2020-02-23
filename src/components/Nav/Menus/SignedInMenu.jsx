import React from "react";
import { Menu, Image, Dropdown } from "semantic-ui-react";

const SignedInMenu = ({ signOut, username, avatar }) => {
  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src='https://randomuser.me/api/portraits/lego/5.jpg' />
      <Dropdown pointing='top left' text={username}>
        <Dropdown.Menu>
          <Dropdown.Item text='Create Event' icon='plus' />
          <Dropdown.Item text='My Events' icon='calendar' />
          <Dropdown.Item text='My Network' icon='users' />
          <Dropdown.Item text='My Profile' icon='user' />
          <Dropdown.Item text='Settings' icon='settings' />
          <Dropdown.Item onClick={signOut} text='Sign Out' icon='power' data-test='sign-out-button' />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
