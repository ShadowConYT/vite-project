import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from './slices/authSlice';
import shimentSlice from './slices/shipmentSlice';

const reducer = combineReducers({
    auth: authSlice,
    shipment: shimentSlice,
});

const store = configureStore({
    reducer,
});

export default store;