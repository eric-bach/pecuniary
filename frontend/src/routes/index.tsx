import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}));

  return (
    <div className='p-2 flex flex-col gap-2 max-w-lg mx-auto mt-10'>
      <h1 className='text-2xl font-bold'>Pecuniary</h1>
      <Link to='/dashboard' className='text-blue-500 hover:underline'>
        Get Started
      </Link>
      {data.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>
  );
}
