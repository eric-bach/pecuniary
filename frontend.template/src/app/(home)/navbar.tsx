'use client';

import Link from 'next/link';
import NavLink from './navlink';

const Navbar = () => {
  return (
    <header>
      <nav className={`bg-white w-full md:static md:text-sm fixed z-10 h-full`}>
        <div className='custom-screen items-center mx-auto md:flex'>
          <div className='flex items-center justify-between py-3 md:py-5 md:block'>
            <Link href='/'>
              <img src='/logo.png' width={52} height={52} alt='Pecuniary Logo' />
            </Link>
          </div>
          <div className={`flex-1 pb-3 mt-8 md:pb-0 md:mt-0 md:block`}>
            <ul className='text-gray-700 justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0 md:text-gray-600 md:font-medium'>
              <li>
                <NavLink
                  href='/dashboard'
                  className='block font-medium text-sm text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 md:inline'
                >
                  Sign in
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
