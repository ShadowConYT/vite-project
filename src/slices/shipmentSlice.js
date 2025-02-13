import { createSlice } from "@reduxjs/toolkit";

const shipmentSlice = createSlice({
    name: 'shipment',
    initialState: {
        loading: true,
        error: null,
        shipments: [],
        shipmentErrors: [],
        downloadLoading: false,
        isDownloadEmailSent: false,
        loadedShipmentsFromDatabase: []
    },
    reducers: {
        getShipmentsRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        getShipmentsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                shipments: action.payload.shipments,
                shipmentErrors: action.payload.errors
            }
        },
        getShipmentsFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        loadShipmentDetailsRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        loadShipmentDetailsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                loadedShipmentsFromDatabase: action.payload.shipments,
            }
        },
        loadShipmentDetailsFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        clearShipmentErrors(state, action) {
            return {
                ...state,
                shipmentErrors: []
            }
        },
    }
})

const { actions, reducer } = shipmentSlice;
export const {
    getShipmentsRequest,
    getShipmentsSuccess,
    getShipmentsFailure,
    loadShipmentDetailsRequest,
    loadShipmentDetailsSuccess,
    loadShipmentDetailsFailure,
    clearShipmentErrors 
} = actions;
export default reducer;