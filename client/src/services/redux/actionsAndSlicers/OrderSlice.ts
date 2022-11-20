import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Configuration, Order, OrderApi } from 'openapi';

const configuration = new Configuration({
	basePath: 'https://mjmyx0xl0j.execute-api.ap-southeast-1.amazonaws.com',
});

const orderApi = new OrderApi(configuration);

export const createOrderAsync = createAsyncThunk(
	'order/createOrder',
	async (order: Order) => {
		await orderApi.createOrder({ order })
		return { hello: 'true' };
	}
);


const initialState = {
	orders: undefined,
	status: 'idle',
};

const OrderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrderAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(createOrderAsync.fulfilled, (state) => {
				state.status = 'idle';
			});
	}
});


export default OrderSlice;
