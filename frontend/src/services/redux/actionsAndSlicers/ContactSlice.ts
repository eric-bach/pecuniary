import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from 'openapi';



const initialState: Contact = {
	email: ''
};

const ContactSlice = createSlice({
	name: 'Contact',
	initialState,
	reducers: {
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload
		}
	},
});

export default ContactSlice;
