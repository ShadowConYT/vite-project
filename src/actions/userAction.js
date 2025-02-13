import { loginRequest, loginSuccess, loginFailure } from '../slices/authSlice';
import axios from 'axios';


export const loginUser = (formData) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post('http://localhost:8000/api/v0/auth/login', formData);
        const access_token = data.access_token;
        localStorage.setItem('access_token', access_token);
        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loginRequest());
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        const { data } = await axios.get('http://localhost:8000/api/v0/users/me');
        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
}