import { RootState } from "../index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFriend } from "../../service/friendService";
import { isLoading } from "expo-font";

export interface Friend {
  user: any;
  friends: Array<any>;
  friendInvites: Array<any>;
  friendMeInvites: Array<any>;
  isLoading: boolean;
}

const initialState: Friend = {
  user: null,
  friends: [],
  friendInvites: [],
  friendMeInvites: [],
  isLoading: false,
};

const NAME = "friend";

export const getFriends = createAsyncThunk("friend/list", async () => {
  const rs = await apiFriend.getFriends();
  return rs.data;
});

export const inviteFriend = createAsyncThunk(
  "friend/invite",
  async (result: any) => {
    const rs = await apiFriend.inviteFriend(result._id);
    return result;
  }
);

export const deleteInvive = createAsyncThunk(
  "friend/deleteInvite",
  async (id: string) => {
    const rs = await apiFriend.deleteInvive(id);
    return id;
  }
);

export const deleteMeInvive = createAsyncThunk(
  "friend/deleteMeInvite",
  async (id: string) => {
    const rs = await apiFriend.deleteMeInvive(id);
    return id;
  }
);

export const acceptFriend = createAsyncThunk(
  "friend/accept",
  async (id: string) => {
    const rs = await apiFriend.acceptFriend(id);
    return id;
  }
);

export const deleteFriendAsync = createAsyncThunk(
  "friend/deleteFriend",
  async (id: string) => {
    const res = apiFriend.deleteFriend(id);
    return id;
  }
);

export const getListInvite = createAsyncThunk("friend/listInvite", async () => {
  const rs = await apiFriend.getListInvite();
  return rs.data;
});

export const getListMeInvite = createAsyncThunk(
  "friend/listMeInvite",
  async () => {
    const rs = await apiFriend.getListMeInvite();
    return rs.data;
  }
);

const friendSlice = createSlice({
  name: NAME,
  initialState,

  reducers: {
    recieveInvite: (state, action) => {
      if (action.payload)
        state.friendInvites = [action.payload, ...state.friendInvites];
    },

    refuseInvite: (state, action) => {
      if (action.payload) {
        state.friendMeInvites = state.friendMeInvites.filter(
          (friend) => friend._id !== action.payload
        );
      }
    },

    cancelMyFriendRequest: (state, action) => {
      if (action.payload) {
        state.friendInvites = state.friendInvites.filter(
          (friend) => friend._id !== action.payload
        );
      }
    },

    deleteFriend: (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend._id !== action.payload
      );
    },

    setNewFriend: (state, action) => {
      const friend = state.friendMeInvites.find(
        (friendMeInvite) => friendMeInvite._id === action.payload
      );
      const newList = state.friendMeInvites.filter(
        (friendMeInvite) => friendMeInvite._id !== action.payload
      );

      state.friends = [friend, ...state.friends];
      state.friendMeInvites = newList;
    },
  },

  extraReducers: (builder) => {
    ////////
    builder.addCase(getFriends.pending, (state, action) => {});
    builder.addCase(getFriends.fulfilled, (state, action) => {
      state.friends = action.payload;
    });
    builder.addCase(getFriends.rejected, (state, action) => {});

    ////////
    // builder.addCase(getFriends.pending, (action, payload) => {});
    // builder.addCase(getFriends.fulfilled, (state, action) => {
    //   state.friends = action.payload;
    // });
    // builder.addCase(getFriends.rejected, (action, payload) => {});

    ////////
    builder.addCase(getListInvite.pending, (state, action) => {});
    builder.addCase(getListInvite.fulfilled, (state, action) => {
      state.friendInvites = action.payload;
    });
    builder.addCase(getListInvite.rejected, (state, action) => {});

    ///

    builder.addCase(getListMeInvite.pending, (state, action) => {});
    builder.addCase(getListMeInvite.fulfilled, (state, action) => {
      state.friendMeInvites = action.payload;
    });
    builder.addCase(getListMeInvite.rejected, (state, action) => {});

    //////
    builder.addCase(inviteFriend.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(inviteFriend.fulfilled, (state, action) => {
      const { _id, name, username, avatar, avatarColor } = action.payload;
      const friendMeInvite = { _id, name, username, avatar, avatarColor };
      state.friendMeInvites = [friendMeInvite, ...state.friendMeInvites];
      state.isLoading = false;
    });

    ////
    builder.addCase(acceptFriend.fulfilled, (state, action) => {
      const friend = state.friendInvites.find(
        (friend) => friend._id === action.payload
      );
      state.friendInvites = state.friendInvites.filter(
        (friend) => friend._id !== action.payload
      );
      state.friends = [friend, ...state.friends];
    });

    /////
    builder.addCase(deleteInvive.fulfilled, (state, action) => {
      state.friendInvites = state.friendInvites.filter(
        (friend) => friend._id !== action.payload
      );
    });

    //////
    builder.addCase(deleteMeInvive.fulfilled, (state, action) => {
      state.friendMeInvites = state.friendMeInvites.filter(
        (friend) => friend._id !== action.payload
      );
    });

    //////
    builder.addCase(deleteFriendAsync.fulfilled, (state, action) => {
      state.friends = state.friends.filter(
        (friend) => friend._id !== action.payload
      );
    });
  },
});

const friendReducer = friendSlice.reducer;

export const friendSeletor = (state: RootState) => state.friendReducer;
export const {
  recieveInvite,
  setNewFriend,
  refuseInvite,
  cancelMyFriendRequest,
  deleteFriend,
} = friendSlice.actions;
export default friendReducer;
