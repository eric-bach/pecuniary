import { create } from 'zustand';
import { Transaction } from '../../../infrastructure/graphql/api/codegen/appsync';

type OpenInvestmentTransactionState = {
  transaction?: Transaction;
  isOpen: boolean;
  onOpen: (account: Transaction) => void;
  onClose: () => void;
};

export const useOpenInvestmentTransaction = create<OpenInvestmentTransactionState>((set) => ({
  transaction: undefined,
  isOpen: false,
  onOpen: (transaction: Transaction) => set({ isOpen: true, transaction }),
  onClose: () => set({ isOpen: false, transaction: undefined }),
}));
