import { create } from 'zustand';
import { Payee } from '../../../backend/src/appsync/api/codegen/appsync';

type OpenPayeeState = {
  payee?: Payee;
  isOpen: boolean;
  onOpen: (payee: Payee) => void;
  onClose: () => void;
};

export const useOpenPayee = create<OpenPayeeState>((set) => ({
  payee: undefined,
  isOpen: false,
  onOpen: (payee: Payee) => set({ isOpen: true, payee }),
  onClose: () => set({ isOpen: false, payee: undefined }),
}));
