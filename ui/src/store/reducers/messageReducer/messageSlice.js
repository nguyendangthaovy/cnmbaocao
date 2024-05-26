import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiMessage } from '../../../api/apiMessage';

export const getMessages = createAsyncThunk('messages/list', async ({ id, page }, thunkApi) => {
    // thunkApi.dispatch(messageLoading(true));
    const list = await apiMessage.getList(id);
    return list.data;
});

export const getMessagesByPage = createAsyncThunk('messages/listByPage', async ({ id, page }, thunkApi) => {
    // thunkApi.dispatch(messageLoading(true));
    const list = await apiMessage.getListByPage({ id, page });
    return list.data;
});

export const sendMessage = createAsyncThunk('message/sended', async (data) => {
    const { conversationId, content, type } = data;
    const response = await apiMessage.sendText({ conversationId, content, type });
    return response.data;
});

export const sendImage = createAsyncThunk('message/sended', async (data) => {
    const { formData, attachInfo, callback } = data;
    const response = await apiMessage.sendFile({ formData, attachInfo, callback });
    return response.data;
});

export const sendImages = createAsyncThunk('message/sended', async (data) => {
    const { formData, attachInfo, callback } = data;
    const response = await apiMessage.sendFiles({ formData, attachInfo, callback });
    return response.data;
});

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        chatting: {},
        messages: {},
        loading: false,
        error: false,
        members: [],
    },
    reducers: {
        setChatting(state, action) {
            state.chatting = action.payload;
        },
        messageLoading(state, action) {
            state.loading = action.payload;
        },
        rerenderMessage(state, action) {
            state.messages.data = [...state.messages.data, action.payload];
        },
        handleRenameGroup(state, action){
            state.messages.data.splice(0,1);
 
        }
    },
    extraReducers: {
        // [getMessages.pending]: (state, action) => {},
        [getMessages.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;

            state.messages = action.payload;
        },
        [sendMessage.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
            state.messages.data = [...state.messages.data, action.payload];
        },
        [sendImage.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
            state.messages.data = [...state.messages.data, action.payload];
        },
        [getMessagesByPage.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
            const oldData = state.messages.data ? state.messages.data : [];
            if(oldData.length > 0)
                oldData.splice(0,1);
            state.messages = {
                ...action.payload,
                data: [...action.payload.data, ...oldData],
            };
        },
    },
});

const { actions, reducer } = messageSlice;
const messageReducer = reducer;

export const messagesSelector = (state) => state.messageReducer.messages;

export const { setChatting, messageLoading, rerenderMessage, handleRenameGroup } = actions;

export default messageReducer;
