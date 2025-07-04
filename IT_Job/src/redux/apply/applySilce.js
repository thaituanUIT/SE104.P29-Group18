import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxios from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
    appliedJobs: [],
    loading: false,
    error: null
}


export const fetchAppliedJobs = createAsyncThunk(
    'apply/fetchAppliedJobs',

    async (email) => {
        const response = await authorizedAxios.get(`${API_ROOT}/server/apply/applied-jobs`, {
            params: { email }, // Send email as query param
        });
        return response.data
    }
)

const applySlice = createSlice({
    name: 'apply',
    initialState,
    
    reducers: {
        clearAppliedJobs: (state) => {
            state.appliedJobs = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.appliedJobs = action.payload;
            })
    },
});

export const { clearAppliedJobs } = applySlice.actions;
export const selectAppliedJobs = (state) => state.apply.appliedJobs;
export const selectApplyLoading = (state) => state.apply.loading;
export const selectApplyError = (state) => state.apply.error;

export const applyReducer = applySlice.reducer;