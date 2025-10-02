'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ResizableSidebarProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function ResizableSidebar({
  children,
  defaultWidth = 224, // 14rem = 224px
  minWidth = 200,
  maxWidth = 400,
  className,
}: ResizableSidebarProps) {
  const [width, setWidth] = React.useState(() => {
    // Load saved width from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-width');
      return saved ? Math.min(Math.max(parseInt(saved, 10), minWidth), maxWidth) : defaultWidth;
    }
    return defaultWidth;
  });
  const [isResizing, setIsResizing] = React.useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  // Save width to localStorage when it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-width', width.toString());
    }
  }, [width]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleDoubleClick = React.useCallback(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, minWidth, maxWidth]);

  return (
    <div className='relative flex'>
      <div
        ref={sidebarRef}
        className={cn('relative flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200', className)}
        style={{ width }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-500/20 transition-colors group',
          'after:absolute after:right-0 after:top-0 after:h-full after:w-3 after:-translate-x-1/2',
          isResizing && 'bg-blue-500/30'
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title='Drag to resize sidebar • Double-click to reset'
      >
        {/* Visual indicator - vertical line */}
        <div
          className={cn(
            'absolute right-0 top-1/2 h-8 w-0.5 bg-border/50 transition-all group-hover:bg-blue-500 group-hover:h-12 -translate-y-1/2',
            isResizing && 'bg-blue-500 h-12'
          )}
        />
      </div>
    </div>
  );
}
