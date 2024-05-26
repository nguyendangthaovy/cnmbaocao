import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiUser } from '../../../api/apiUser';

export const getProfile = createAsyncThunk('me/getProfile', async () => {
    const rs = await apiUser.getProfile();
    return rs.data;
});

export const updateProfile = createAsyncThunk('me/updateProfile', async(data)=>{
    const {name,birthDay,gender} = data;
    const rs = await apiUser.updateProfile({name,birthDay,gender})
    return rs.data;
})
export const updateAvatar = createAsyncThunk('me/avatar', async(data)=>{
    const avatar = data;
    const rs = await apiUser.updateAvatar(avatar)
    return rs.data;
})

const meSlice = createSlice({
    name: 'me',
    initialState: {
        user: null
    },
    reducers: {
        setUser(state, action) {
            state.user.name = action.payload.name;
        },
    },
    extraReducers: {
        [getProfile.fulfilled]: (state, action) => {
            state.user = action.payload;
        },
        // ,
        // [updateProfile.pending]:(state,action)=>{
        //     state.user = action.payload;
        // },
        // [updateProfile.rejected]:(state,action)=>{
        //     state.user = action.payload;
        // },
        [updateProfile.fulfilled]:(state,action)=>{
            state.user = action.payload;
        },
        [updateAvatar.fulfilled]:(state,action)=>{
            state.user = action.payload;
        }

    },
});
const { actions, reducer } = meSlice;
const meReducer = reducer;
export const {setUser} = actions;

export const meSelector = (state) => state.meReducer.user;
export default meReducer;
