import { create } from 'zustand';

type SidebarState = {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
};

export const useSidebarExpanded = create<SidebarState>((set) => ({
  isSidebarExpanded: true,
  setIsSidebarExpanded: (expanded) => set({ isSidebarExpanded: expanded }),
}));
