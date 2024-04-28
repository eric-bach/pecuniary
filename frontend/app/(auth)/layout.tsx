'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-white'>
      <main className='isolate'>
        <div className='sm:pt-12'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>{children}</div>
        </div>
      </main>
    </div>
  );
}
