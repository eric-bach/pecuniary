import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product as OrderProduct } from 'openapi';

export declare type Product = {
    id: string,
    name: string,
    description: string,
    price: number,
    thumbnail_url: string,
    options?: { [key: string]: any; };
    quantity?: number
}


type ProductState = {
	products: Product[]
	selectedProducts: OrderProduct[];
	loading: boolean
};

export const fetchProducts = createAsyncThunk(
	'product/fetchProducts',
	async () => {
		const response = await fetch(`${process.env.ORDERS_API_URL?? 'https://sss9czm0s0.execute-api.ap-southeast-1.amazonaws.com'}/v1/products`);
		const j = await response.json();
		return j
	});


const initialState: ProductState = {
	loading: false,
	products: [],
	selectedProducts: [],
};

const ProductSlice = createSlice({
	name: 'ProductSelection',
	initialState,
	reducers: {
		setSelectedProducts(state: ProductState, action: PayloadAction<OrderProduct[]>) {
			state.selectedProducts = action.payload;
		},
		updateSelectedProduct(state, action: PayloadAction<Product>) {
			state.selectedProducts = state.selectedProducts.map(item => (item.id === action.payload.id ? action.payload : item));
		},
		deleteSelectedProduct(state, action: PayloadAction<string>) {
			state.selectedProducts = state.selectedProducts.filter(item => item.id !== action.payload);
		},
	},

	extraReducers: (builder) => {
		builder.addCase(fetchProducts.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(fetchProducts.fulfilled, (state, action) => {
			state.loading = false;
			state.products = action.payload;
		});
	},
});

export default ProductSlice;
