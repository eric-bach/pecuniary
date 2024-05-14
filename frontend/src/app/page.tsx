import Link from 'next/link';
import Image from 'next/image';
import PecuniaryLogo from '@/components/pecuniary-logo';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col '>
      <div className='flex h-20 shrink-0 items-end bg-blue-500 p-4 md:h-52'>
        <PecuniaryLogo />
      </div>
      <div className='flex grow flex-col gap-4 md:flex-row'>
        <div className='flex flex-col justify-center gap-6 bg-gray-50 px-6 py-10 md:w-2/5 md:px-20'>
          <p className='text-xl text-gray-800 md:text-3xl md:leading-normal'>
            <strong>Welcome to Pecuniary</strong>
          </p>
          <Link
            href='/auth/login'
            className='flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base'
          >
            <span>Log in</span>
          </Link>
        </div>
        <div className='flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12'>
          <Image
            src='/hero-desktop.png'
            width={1000}
            height={760}
            className='hidden md:block'
            alt='Screenshots of the dashboard project showing desktop version'
          />
          <Image
            src='/hero-mobile.png'
            width={560}
            height={620}
            className='block md:hidden'
            alt='Screenshots of the dashboard project showing mobile version'
          />
        </div>
      </div>
    </main>
  );
}
