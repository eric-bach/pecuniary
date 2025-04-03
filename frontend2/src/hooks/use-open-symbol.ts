import { create } from 'zustand';
import { Symbol } from '../../../backend/src/appsync/api/codegen/appsync';

type OpenSymbolState = {
  symbol?: Symbol;
  isOpen: boolean;
  onOpen: (symbol: Symbol) => void;
  onClose: () => void;
};

export const useOpenSymbol = create<OpenSymbolState>((set) => ({
  symbol: undefined,
  isOpen: false,
  onOpen: (symbol: Symbol) => set({ isOpen: true, symbol }),
  onClose: () => set({ isOpen: false, symbol: undefined }),
}));
