import Link from 'next/link';

export default function Hero() {
  return (
    <section className='text-gray-600 body-font'>
      <div className='container mx-auto flex px-5 py-24 items-center justify-center flex-col'>
        <div className='text-center lg:w-2/3 w-full'>
          <h1 className='title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900'>
            Track and manage all your personal finances and investments all in one place
          </h1>
          <p className='mb-8 leading-relaxed'>
            Pecuniary makes it simple for you to track your accounts, investments, and spending all in one place. Get started today and take
            control of your finances..
          </p>
          <div className='flex justify-center'>
            <Link
              href='/dashboard'
              className='py-2 px-6 inline-flex text-center text-white bg-indigo-500 border-0 focus:outline-none hover:bg-indigo-600 rounded-md text-lg'
            >
              Sign in
            </Link>

            <Link
              href='/auth'
              className='ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded-md text-lg'
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
