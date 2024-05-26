import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import httpRequest from "../../utils/httpRequest";

const NAME = "login";

export interface Auth {
  currentUserId: string;
  isLogin: boolean;
  isLoading: boolean;
  token: string;
  isRegister: boolean;
}

const initialState: Auth = {
  currentUserId: "",
  isLogin: false,
  isLoading: false,
  token: "",
  isRegister: false,
};

export const fetchLogin = createAsyncThunk(
  `${NAME}/fetchLogin`,
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const res = await httpRequest.post(
        "auth/login",
        { username, password },
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const authSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    resetAuthSlice: (state, action) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    ///////// Login ////////
    builder.addCase(fetchLogin.pending, (state, action) => {});
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      // console.log(action.payload.token)
      if (action.payload) {
        state.token = action.payload.token;
        state.isLogin = true;
      }
    });
    builder.addCase(fetchLogin.rejected, (state, action) => {});
  },
});

const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.authReducer;

export const { setLoading, setLogin, setCurrentUserId, resetAuthSlice } =
  authSlice.actions;

export default authReducer;
