import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authSlice from './slices/authSlice';
import shimentSlice from './slices/shipmentSlice';
import materialSlice from './slices/materials';

const reducer = combineReducers({
    auth: authSlice,
    shipment: shimentSlice,
    material: materialSlice,
});

const store = configureStore({
    reducer,
});

export default store;