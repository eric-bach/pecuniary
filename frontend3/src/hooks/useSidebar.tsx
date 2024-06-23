// import { create } from 'zustand';

// interface SidebarStore {
//   isMinimized: boolean;
//   toggle: () => void;
// }

// export const useSidebar = create<SidebarStore>((set) => ({
//   isMinimized: false,
//   toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
// }));

import { useState, useCallback } from 'react';

export const useSidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return { isMinimized, toggle };
};
