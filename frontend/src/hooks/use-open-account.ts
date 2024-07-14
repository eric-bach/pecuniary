import { create } from 'zustand';
import { Account } from '../../../backend/src/appsync/api/codegen/appsync';

type OpenAccountState = {
  account?: Account;
  isOpen: boolean;
  onOpen: (account: Account) => void;
  onClose: () => void;
};

export const useOpenAccount = create<OpenAccountState>((set) => ({
  account: undefined,
  isOpen: false,
  onOpen: (account: Account) => set({ isOpen: true, account }),
  onClose: () => set({ isOpen: false, account: undefined }),
}));
