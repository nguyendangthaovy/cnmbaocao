import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../service/userService";
import { RootState } from "../../store";


export interface User {
    isLoading : boolean,
    isError : boolean,
    id: string,
    name : string,
    username : string,
    avatar : string,
    status : string,
    avatarColor : string
}

const initialState : User = {
    isLoading : true,
    isError : false,
    id: "",
    name : "",
    username : "",
    avatar : "",
    status : "",
    avatarColor : ""
}

const NAME = "user"


export const getUserByUserName = createAsyncThunk(`${NAME}/username`,async (username : string) => {
    const res = await userApi.fetchUsers(username);
    return res.data
})

export const getUserById = createAsyncThunk(`${NAME}/id`,async (id : string) => {
    const res = await userApi.fetchUserById(id);
    return res.data
})



const userSlice = createSlice({
    name : NAME,
    initialState,
    reducers : {
        resetUserSlice: (state, action) => {
            Object.assign(state, initialState); 
          },
    },
    extraReducers : (builder) => {
        builder.addCase(getUserByUserName.pending, (state, action) => {
            // state.isLoading = true
        })
        builder.addCase(getUserByUserName.fulfilled, (state, action) => {
            
            if(action.payload){
                state.isLoading =false
                state.id = action.payload._id
                state.name = action.payload.name
                state.username = action.payload.username
                state.avatar = action.payload.avatar
                state.avatarColor = action.payload.avatarColor
                state.status = action.payload.status
            }
        })
        builder.addCase(getUserByUserName.rejected, (state, action) => {
            console.log("erorr")
            state.isError = true;
        })

        /////////

        builder.addCase(getUserById.pending, (state, action) => {
            // state.isLoading = true
        })
        builder.addCase(getUserById.fulfilled, (state, action) => {
            // console.log(action.payload)
            if(action.payload){
                state.isLoading =false
                state.id = action.payload._id
                state.name = action.payload.name
                state.username = action.payload.username
                state.avatar = action.payload.avatar
                state.avatarColor = action.payload.avatarColor
                state.status = action.payload.status
            }
        })
        builder.addCase(getUserById.rejected, (state, action) => {
            console.log("erorr")
            state.isError = true;
        })
    }

})


const userReducer = userSlice.reducer;

export const userSelector = (state: RootState) => state.userReducer;

export const {resetUserSlice} = userSlice.actions 


export default userReducer;