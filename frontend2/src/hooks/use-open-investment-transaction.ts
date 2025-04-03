import { create } from 'zustand';
import { InvestmentTransaction } from '../../../backend/src/appsync/api/codegen/appsync';

type OpenInvestmentTransactionState = {
  transaction?: InvestmentTransaction;

  isOpen: boolean;
  onOpen: (transaction: InvestmentTransaction) => void;
  onClose: () => void;
};

export const useOpenInvestmentTransaction = create<OpenInvestmentTransactionState>((set) => ({
  transaction: undefined,

  isOpen: false,
  onOpen: (transaction: InvestmentTransaction) => set({ isOpen: true, transaction }),
  onClose: () => set({ isOpen: false, transaction: undefined }),
}));
