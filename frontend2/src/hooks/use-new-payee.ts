import { create } from 'zustand';

type NewPayeeState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewPayee = create<NewPayeeState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
