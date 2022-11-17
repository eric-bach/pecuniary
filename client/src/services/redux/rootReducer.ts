import {combineReducers} from '@reduxjs/toolkit';

import AppSlice from './actionsAndSlicers/AppSlice';
import ContactSlice from './actionsAndSlicers/ContactSlice';
import OptionsAndCriteriaSlice from './actionsAndSlicers/OptionsAndCriteriaSlice';
import ProductSelectionSlice from './actionsAndSlicers/ProductSelectionSlice';
import RatedOptionsSlice from './actionsAndSlicers/RatedOptionsSlice';
import WeightedCriteriaSlice from './actionsAndSlicers/WeightCriteriaSlice';
import DeliveryAddressSlice from './actionsAndSlicers/DeliveryAddressSlice';
import OrderSlice from './actionsAndSlicers/OrderSlice';
import ProductSlice from './actionsAndSlicers/ProductSlice';

const rootReducer = combineReducers({
	App: AppSlice.reducer,
	OptionsAndCriteria: OptionsAndCriteriaSlice.reducer,
	WeightedCriteria: WeightedCriteriaSlice.reducer,
	RatedOptions: RatedOptionsSlice.reducer,
	ProductSelection: ProductSelectionSlice.reducer,
	Contact: ContactSlice.reducer,
	DeliveryAddress: DeliveryAddressSlice.reducer,
	Order: OrderSlice.reducer,
	Product: ProductSlice.reducer,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
