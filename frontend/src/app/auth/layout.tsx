import { Sun } from 'lucide-react';
import { ThemeToggler } from '@/components/theme-toggler';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-[100vh] flex items-center justify-center relative'>
      <div className='absolute bottom-5 right-0 flex text-black dark:text-white items-center gap-1 px-3'>
        <Sun className='w-6 h-6' />
        <ThemeToggler />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
