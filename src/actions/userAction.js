import { jwtDecode } from "jwt-decode";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerFailure,
  registerSuccess,
  logOutRequest,
  logOutSuccess,
  logOutFailure,
} from "../slices/authSlice";
import axios from "axios";

export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(
      "http://localhost:8000/api/v0/auth/register",
      formData
    );
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFailure(error.message));
  }
};

export const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(
      "http://localhost:8000/api/v0/auth/login",
      formData
    );
    console.log("Login response data:", data);
    localStorage.setItem("access_token", data.access_token);
    const userData = jwtDecode(data.access_token);
    console.log("Decoded user data:", userData);
    dispatch(loginSuccess(userData));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.detail || error.message));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("access_token")}`;
    const { data } = await axios.get("http://localhost:8000/api/v0/users/me");
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logOutUser = () => async (dispatch) => {
  try {
    dispatch(logOutRequest());
    localStorage.removeItem("access_token");
    dispatch(logOutSuccess(null));
  } catch (error) {
    dispatch(logOutFailure(error.message));
  }
};
