import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
      <div className='flex w-full space-x-4'>
        <Skeleton className='h-[125px] w-full rounded-xl' />
      </div>
    </div>
  );
}
