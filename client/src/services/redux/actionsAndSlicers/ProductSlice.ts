import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from 'openapi';


type ProductState = {
	products: Product[];
};

const initialState: ProductState = {
	products: [],
};

const ProductSlice = createSlice({
	name: 'ProductSelection',
	initialState,
	reducers: {
		setSelectedProducts(state: ProductState, action: PayloadAction<Product[]>) {
			state.products = action.payload;
		},
		updateSelectedProduct(state, action: PayloadAction<Product>) {
			state.products = state.products.map(item => (item.id === action.payload.id ? action.payload : item));
		},
		deleteSelectedProduct(state, action: PayloadAction<string>) {
			state.products = state.products.filter(item => item.id !== action.payload);
		},
	},
});

export default ProductSlice;
