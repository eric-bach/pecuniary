import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className='p-2 flex flex-col gap-2 max-w-lg mx-auto mt-10'>
      <h1 className='text-2xl font-bold'>Pecuniary</h1>
      <Link to='/dashboard' className='text-blue-500 hover:underline'>
        Get Started
      </Link>
    </div>
  );
}
