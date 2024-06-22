import Image from 'next/image';
import Link from 'next/link';
import logo from '@/../public/logo.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggler from './theme-toggler';

const Navbar = () => {
  return (
    <div className='bg-primary dark:bg-slate-700 py-2 px-5 flex justify-between'>
      <Link href='/'>
        <Image src={logo} alt='Pecuniary' width={40} />
      </Link>

      <div className='flex items-center'>
        <ThemeToggler />
        <DropdownMenu>
          <DropdownMenuTrigger className='focus:outline-none'>
            <Avatar>
              <AvatarImage src='https://github.com/eric-bach.png' alt='@shadcn' />
              <AvatarFallback className='text-black'>BT</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href='/profile'>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href='/auth/logout'>Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
