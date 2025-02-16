import axios from "axios";
import { getShipmentsRequest, 
         getShipmentsSuccess, 
         getShipmentsFailure, 
         loadShipmentDetailsFailure,
         loadShipmentDetailsRequest, 
         loadShipmentDetailsSuccess } from '../slices/shipmentSlice';

export const getShipmentDetails = (formData) => async (dispatch) => {
    try {
        dispatch(getShipmentsRequest());
        const { data } = await axios.post( `http://localhost:8000/api/v0/shipment-tracking/`, formData);
        // dispatch(loadShipmentDetailsSuccess(data));
        dispatch(getShipmentsSuccess(data));
    } catch (error) {
        dispatch(getShipmentsFailure(error.message));
    }
}

export const loadShipmentDetails = () => async (dispatch) => {
    try {
        dispatch(loadShipmentDetailsRequest());
        const { data } = await axios.get(`http://localhost:8000/api/v0/shipment-tracking/`);
        dispatch(loadShipmentDetailsSuccess(data));
    } catch (error) {
        dispatch(loadShipmentDetailsFailure(error.message));
    }
}