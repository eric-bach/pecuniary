import React from "react";
import { Menu, Image, Dropdown } from "semantic-ui-react";
import faker from "faker";

const SignedInMenu = ({ signOut, username }) => {
  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={faker.image.avatar()} />
      <Dropdown pointing='top left' text={username}>
        <Dropdown.Menu>
          <Dropdown.Item text='Create Event' icon='plus' />
          <Dropdown.Item text='My Events' icon='calendar' />
          <Dropdown.Item text='My Network' icon='users' />
          <Dropdown.Item text='My Profile' icon='user' />
          <Dropdown.Item text='Settings' icon='settings' />
          <Dropdown.Item onClick={signOut} text='Sign Out' icon='power' />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
