import React from 'react';
import { Input, Link, Navbar, NavbarContent } from '@nextui-org/react';
import { GithubIcon } from '../icons/navbar/github-icon';
import { SupportIcon } from '../icons/navbar/support-icon';
import { SearchIcon } from '../icons/searchicon';
import { BurguerButton } from './burguer-button';
import { NotificationsDropdown } from './notifications-dropdown';
import { UserDropdown } from './user-dropdown';

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
      <Navbar
        isBordered
        className='w-full'
        classNames={{
          wrapper: 'w-full max-w-full',
        }}
      >
        <NavbarContent className='md:hidden'>
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className='w-full max-md:hidden'>
          <Input
            startContent={<SearchIcon />}
            isClearable
            className='w-full'
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder='Search...'
          />
        </NavbarContent>
        <NavbarContent justify='end' className='w-fit data-[justify=end]:flex-grow-0'>
          <NotificationsDropdown />

          <div className='max-md:hidden'>
            <SupportIcon />
          </div>

          <Link href='https://github.com/eric-bach/pecuniary' target={'_blank'}>
            <GithubIcon />
          </Link>
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
