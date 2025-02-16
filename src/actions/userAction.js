import { loginRequest, loginSuccess, loginFailure, registerRequest, registerFailure, registerSuccess } from '../slices/authSlice';
import axios from 'axios';

export const registerUser = (formData) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        const { data } = await axios.post('http://localhost:8000/api/v0/auth/register', formData);
        dispatch(registerSuccess(data));
    } catch (error) {
        dispatch(registerFailure(error.message));
    }
}

export const loginUser = (formData) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post('http://localhost:8000/api/v0/auth/login', formData);
        localStorage.setItem('access_token', data.access_token);
        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFailure(error.response?.data?.detail || error.message));
    }
};

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

export const logOut = () => async (dispatch) => {
    try {
        dispatch(loginRequest());
        localStorage.removeItem('access_token');
        dispatch(loginSuccess(null));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
}