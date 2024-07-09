import { create } from 'zustand';

type NewTransactionState = {
  accountId: string;

  isBankingOpen: boolean;
  isInvestmentOpen: boolean;

  onBankingOpen: (accountId: string) => void;
  onInvestmentOpen: (accountId: string) => void;
  onClose: () => void;
};

export const useNewTransaction = create<NewTransactionState>((set) => ({
  accountId: '',
  isBankingOpen: false,
  isInvestmentOpen: false,

  onBankingOpen: (accountId: string) => set({ isBankingOpen: true, isInvestmentOpen: false, accountId }),
  onInvestmentOpen: (accountId: string) => set({ isBankingOpen: false, isInvestmentOpen: true, accountId }),
  onClose: () => set({ isBankingOpen: false, isInvestmentOpen: false, accountId: '' }),
}));
