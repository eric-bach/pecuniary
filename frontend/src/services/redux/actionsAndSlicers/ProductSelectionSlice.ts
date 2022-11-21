import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from 'openapi';


type ProductSelectionState = {
	selectedProducts: Product[];
};

const initialState: ProductSelectionState = {
	selectedProducts: [],
};

const ProductSelectionSlice = createSlice({
	name: 'ProductSelection',
	initialState,
	reducers: {
		setSelectedProducts(state: ProductSelectionState, action: PayloadAction<Product[]>) {
			state.selectedProducts = action.payload;
		},
		addSelectedProduct(state, action: PayloadAction<Product>) {
			state.selectedProducts = [action.payload, ...state.selectedProducts];
		},
		updateSelectedProduct(state, action: PayloadAction<Product>) {
			state.selectedProducts = state.selectedProducts.map(item => (item.id === action.payload.id ? action.payload : item));
		},
		deleteSelectedProduct(state, action: PayloadAction<string>) {
			state.selectedProducts = state.selectedProducts.filter(item => item.id !== action.payload);
		},
	},
});

export default ProductSelectionSlice;
