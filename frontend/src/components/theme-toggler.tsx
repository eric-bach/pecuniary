'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export const ThemeToggler = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className='flex items-center space-x-2 pr-2'>
      <Switch id='theme-mode' checked={resolvedTheme === 'dark' ? true : false} onCheckedChange={(e) => setTheme(e ? 'dark' : 'light')} />
    </div>
  );
};
