import { create } from 'zustand';
import { BankTransaction } from '../../../infrastructure/graphql/api/codegen/appsync';

type OpenBankTransactionState = {
  transaction?: BankTransaction;

  isOpen: boolean;
  onOpen: (transaction: BankTransaction) => void;
  onClose: () => void;
};

export const useOpenBankTransaction = create<OpenBankTransactionState>((set) => ({
  transaction: undefined,

  isOpen: false,
  onOpen: (transaction: BankTransaction) => set({ isOpen: true, transaction }),
  onClose: () => set({ isOpen: false, transaction: undefined }),
}));
