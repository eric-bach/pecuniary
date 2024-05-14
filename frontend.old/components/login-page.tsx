'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { Authenticator, Theme, ThemeProvider, View } from '@aws-amplify/ui-react';

import { link as linkStyles } from '@nextui-org/theme';

import { siteConfig } from '@/config/site';
import NextLink from 'next/link';
import clsx from 'clsx';

import { ThemeSwitch } from '@/components/theme-switch';
import { TwitterIcon, GithubIcon, DiscordIcon } from '@/components/icons';

import { Logo } from '@/components/icons';

const theme: Theme = {
  name: 'Theme',
  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: '#1976d2',
        },
        link: {
          color: '#1976d2',
        },
        _focus: { backgroundColor: '#1976d2' },
      },
      tabs: {
        item: {
          color: '#1976d2',
          _hover: {
            borderColor: '#1976d2',
            color: '#1976d2',
          },
          _active: {
            borderColor: '#1976d2',
            color: '#1976d2',
          },
        },
      },
    },
  },
};

const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
    },
  },
  signUp: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
      order: 1,
    },
    password: {
      order: 2,
    },
    confirm_password: {
      order: 3,
    },
  },
};

export default function LoginPag({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Authenticator formFields={formFields} hideSignUp={false}>
        {({ signOut, user }) => (
          <main>
            <NextUINavbar maxWidth='xl' position='sticky'>
              <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
                <NavbarBrand as='li' className='gap-3 max-w-fit'>
                  <NextLink className='flex justify-start items-center gap-1' href='/'>
                    <Logo />
                    <p className='font-bold text-inherit'>Pecuniary</p>
                  </NextLink>
                </NavbarBrand>
                <ul className='hidden lg:flex gap-4 justify-start ml-2'>
                  {siteConfig.navItems.map((item) => (
                    <NavbarItem key={item.href}>
                      <NextLink
                        className={clsx(
                          linkStyles({ color: 'foreground' }),
                          'data-[active=true]:text-primary data-[active=true]:font-medium'
                        )}
                        color='foreground'
                        href={item.href}
                      >
                        {item.label}
                      </NextLink>
                    </NavbarItem>
                  ))}
                </ul>
              </NavbarContent>

              <NavbarContent className='hidden sm:flex basis-1/5 sm:basis-full' justify='end'>
                <NavbarItem className='hidden sm:flex gap-2'>
                  <Link isExternal href={siteConfig.links.twitter} aria-label='Twitter'>
                    <TwitterIcon className='text-default-500' />
                  </Link>
                  <Link isExternal href={siteConfig.links.discord} aria-label='Discord'>
                    <DiscordIcon className='text-default-500' />
                  </Link>
                  <Link isExternal href={siteConfig.links.github} aria-label='Github'>
                    <GithubIcon className='text-default-500' />
                  </Link>
                  <ThemeSwitch />
                </NavbarItem>
                <NavbarItem>
                  {user ? (
                    <form action={signOut}>
                      <Button type='submit' color='primary' variant='flat'>
                        Sign Out
                      </Button>
                    </form>
                  ) : (
                    <Button as='link' color='primary' href='#' variant='flat'>
                      Sign In
                    </Button>
                  )}
                </NavbarItem>
              </NavbarContent>

              <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
                <Link isExternal href={siteConfig.links.github} aria-label='Github'>
                  <GithubIcon className='text-default-500' />
                </Link>
                <ThemeSwitch />
                <NavbarMenuToggle />
              </NavbarContent>

              <NavbarMenu>
                <div className='mx-4 mt-2 flex flex-col gap-2'>
                  {siteConfig.navMenuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                      <Link
                        color={index === 2 ? 'primary' : index === siteConfig.navMenuItems.length - 1 ? 'danger' : 'foreground'}
                        href='#'
                        size='lg'
                      >
                        {item.label}
                      </Link>
                    </NavbarMenuItem>
                  ))}
                </div>
              </NavbarMenu>
            </NextUINavbar>
            {/* <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button> */}
            <main className='container mx-auto max-w-7xl pt-16 px-6 flex-grow'>{children}</main>
          </main>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
