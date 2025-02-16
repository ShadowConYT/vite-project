import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isAuthenticated: false,
        isRegistered: false,
        user: null,
        error: null,
    },
    reducers: {
        loginRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        loginSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
            }
        },
        loginFailure(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: action.payload,
            }
        },
        registerRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        registerSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isRegistered: true,
                user: action.payload,
            }
        },
        registerFailure(state, action) {
            return {
                ...state,
                loading: false,
                isRegistered: false,
                error: action.payload,
            }
        },
        logOutRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        logOutSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
            }
        },
        logOutFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null,
            }
        }
    },
})

const { actions, reducer } = authSlice;
export const { 
    loginRequest, 
    loginSuccess, 
    loginFailure,
    registerFailure,
    registerRequest,
    registerSuccess,
    logOutRequest,
    logOutSuccess,
    logOutFailure,
    clearError
} = actions;

export default reducer;