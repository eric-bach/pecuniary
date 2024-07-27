import { create } from 'zustand';

type NewSymbolState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewSymbol = create<NewSymbolState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
