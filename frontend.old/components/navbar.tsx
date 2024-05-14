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

import { cookies } from 'next/headers';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';

import { link as linkStyles } from '@nextui-org/theme';

import { getCurrentUser } from 'aws-amplify/auth/server';
import { signOut } from 'aws-amplify/auth';

import { siteConfig } from '@/config/site';
import NextLink from 'next/link';
import clsx from 'clsx';

import { ThemeSwitch } from '@/components/theme-switch';
import { TwitterIcon, GithubIcon, DiscordIcon, HeartFilledIcon, SearchIcon } from '@/components/icons';

import { Logo } from '@/components/icons';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    console.log('Fetting currently logged in user');
    // https://docs.amplify.aws/javascript/build-a-backend/server-side-rendering/nextjs/
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    console.log(currentUser);
    console.log('DONE');
    return currentUser;
  } catch (err) {
    console.log(err);
  }
}

async function logOut() {
  'use server';
  try {
    console.log('signing out');
    await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => signOut(),
    });
  } catch (err) {
    console.log(err);
  }
}

export const Navbar = async () => {
  // const user = await getData();
  // if (user) {
  //   console.log('Logged In');
  // }

  return (
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
                className={clsx(linkStyles({ color: 'foreground' }), 'data-[active=true]:text-primary data-[active=true]:font-medium')}
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
        {/* <NavbarItem>
          {user ? (
            <form action={logOut}>
              <Button type='submit' color='primary' variant='flat'>
                Sign Out
              </Button>
            </form>
          ) : (
            <Button as='link' color='primary' href='#' variant='flat'>
              Sign In
            </Button>
          )}
        </NavbarItem> */}
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
  );
};
