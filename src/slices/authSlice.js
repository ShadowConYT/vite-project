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
    },
})

const { actions, reducer } = authSlice;
export const { loginRequest, loginSuccess, loginFailure } = actions;
export default reducer;