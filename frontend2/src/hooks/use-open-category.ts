import { create } from 'zustand';
import { Category } from '../../../backend/src/appsync/api/codegen/appsync';

type OpenCategoryState = {
  category?: Category;
  isOpen: boolean;
  onOpen: (category: Category) => void;
  onClose: () => void;
};

export const useOpenCategory = create<OpenCategoryState>((set) => ({
  category: undefined,
  isOpen: false,
  onOpen: (category: Category) => set({ isOpen: true, category }),
  onClose: () => set({ isOpen: false, category: undefined }),
}));
