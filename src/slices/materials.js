import { createSlice } from "@reduxjs/toolkit";

const materialsSlice = createSlice({
    name: 'material',
    initialState: {
        loading: true,
        error: null,
        materials: [],
        materialErrors: [],
    },
    reducers: {
        getMaterialsRequest(state, action) {
            return {
                ...state,
                loading: true,
            }
        },
        getMaterialsSuccess(state, action) {
            return {
                ...state,
                loading: false,
                materials: action.payload,
                materialErrors: action.payload.errors
            }
        },
        getMaterialsFailure(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        clearMaterialErrors(state, action) {
            return {
                ...state,
                materialErrors: []
            }
        }
    }
});

export const { getMaterialsRequest, getMaterialsSuccess, getMaterialsFailure, clearMaterialErrors } = materialsSlice.actions;
export default materialsSlice.reducer;