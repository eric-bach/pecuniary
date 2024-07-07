import { create } from 'zustand';

type NewInvestmentTransactionState = {
  accountId: string;
  isOpen: boolean;
  onOpen: (accountId: string) => void;
  onClose: () => void;
};

export const useNewInvestmentTransaction = create<NewInvestmentTransactionState>((set) => ({
  accountId: '',
  isOpen: false,
  onOpen: (accountId: string) => set({ isOpen: true, accountId }),
  onClose: () => set({ isOpen: false, accountId: '' }),
}));
