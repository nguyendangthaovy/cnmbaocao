import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const navSlice = createSlice({
    name: 'nav',
    initialState: {
        navIndex: 0,
    },
    reducers: {
        setIndex: (state, action) => {
            state.navIndex = action.payload;
        },
    },

    extraReducers: {},
});

const navReducer = navSlice.reducer;

export const navSelector = (state) => state.navReducer.navIndex;

export const { setIndex } = navSlice.actions;

export default navReducer;
