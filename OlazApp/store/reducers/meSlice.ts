import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import meApi from "../../service/meService";
import { RootState } from "../../store";
import httpRequest from "../../utils/httpRequest";

const NAME = "me";

export interface Me {
  isLoading: boolean;
  userProfile: any;
  phoneBooks: Array<any>;
}

const initialState: Me = {
  isLoading: false,
  userProfile: {},
  phoneBooks: [],
};

export const getProfile = createAsyncThunk(`${NAME}/fetchProfile`, async () => {
  const res = await meApi.fetchProfile();
  return res.data;
});

export const updateAvatar = createAsyncThunk(
  `${NAME}/fetchUpdateAvatar`,
  async (image: FormData) => {
    const res = await meApi.updateAvatar(image);
    return res.data;
  }
);

const meSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    ///////

    builder.addCase(getProfile.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
    });

    ////
    builder.addCase(updateAvatar.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userProfile.avatar = action.payload;
    });
  },
});

const meReducer = meSlice.reducer;

export const meSelector = (state: RootState) => state.meReducer;

export default meReducer;
