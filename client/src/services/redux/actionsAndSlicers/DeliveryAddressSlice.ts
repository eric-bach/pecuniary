import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryAddress } from 'openapi';



const initialState: DeliveryAddress = {
	address: '',
	phoneNumber: '',
	fullName: ''
};

const DeliveryAddressSlice = createSlice({
	name: 'DeliveryAddress',
	initialState,
	reducers: {
		setAddress(state, action: PayloadAction<string>) {
			state.address = action.payload
		},
		setPhoneNumber(state, action: PayloadAction<string>) {
			state.phoneNumber = action.payload
		},
		setFullName(state, action: PayloadAction<string>) {
			state.fullName = action.payload
		}
	},
});

export default DeliveryAddressSlice;
