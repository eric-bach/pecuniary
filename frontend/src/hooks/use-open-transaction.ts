import { create } from 'zustand';
import { Transaction } from '../../../infrastructure/graphql/api/codegen/appsync';

type OpenTransactionState = {
  transaction?: Transaction;

  isBankingOpen: boolean;
  isInvestmentOpen: boolean;

  onBankingOpen: (transaction: Transaction) => void;
  onInvestmentOpen: (transaction: Transaction) => void;
  onClose: () => void;
};

export const useOpenTransaction = create<OpenTransactionState>((set) => ({
  transaction: undefined,

  isBankingOpen: false,
  isInvestmentOpen: false,

  onBankingOpen: (transaction: Transaction) => set({ isBankingOpen: true, isInvestmentOpen: false, transaction }),
  onInvestmentOpen: (transaction: Transaction) => set({ isBankingOpen: false, isInvestmentOpen: true, transaction }),
  onClose: () => set({ isBankingOpen: false, isInvestmentOpen: false, transaction: undefined }),
}));
