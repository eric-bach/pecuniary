import { create } from 'zustand';
import { BankTransaction, InvestmentTransaction } from '../../../infrastructure/graphql/api/codegen/appsync';

type OpenTransactionState = {
  transaction?: BankTransaction | InvestmentTransaction;

  isBankingOpen: boolean;
  isInvestmentOpen: boolean;

  onBankingOpen: (transaction: BankTransaction) => void;
  onInvestmentOpen: (transaction: InvestmentTransaction) => void;
  onClose: () => void;
};

export const useOpenTransaction = create<OpenTransactionState>((set) => ({
  transaction: undefined,

  isBankingOpen: false,
  isInvestmentOpen: false,

  onBankingOpen: (transaction: BankTransaction) => set({ isBankingOpen: true, isInvestmentOpen: false, transaction }),
  onInvestmentOpen: (transaction: InvestmentTransaction) => set({ isBankingOpen: false, isInvestmentOpen: true, transaction }),
  onClose: () => set({ isBankingOpen: false, isInvestmentOpen: false, transaction: undefined }),
}));
