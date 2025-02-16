import {
    getMaterialsRequest, getMaterialsSuccess, getMaterialsFailure, clearMaterialErrors
} from '../slices/materials';
import axios from 'axios';

export const getMaterials = () => async (dispatch) => {
    try {
        dispatch(getMaterialsRequest());
        const { data } = await axios.get('http://localhost:8000/api/v0/user-objects', {
            headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` }
        });

        dispatch(getMaterialsSuccess(data.object));
    } catch (error) {
        dispatch(getMaterialsFailure(error.message));
    }
}