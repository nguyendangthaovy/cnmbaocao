import jwt from '../utils/jwt';
import axios from './apiConfig';

export const apiMessage = {
    getList: async (id) => {
        return await axios.get(`/messages/${id}`);
    },
    getListByPage: async ({ id, page }) => {
        return await axios.get(`/messages/${id}`, {
            params: {
                page,
            },
        });
    },
    sendText: async ({ conversationId, content, type = 'TEXT' }) => {
        return await axios.post(`/messages/text`, {
            conversationId,
            content,
            type,
        });
    },
    sendFile: async ({ formData, attachInfo, callback }) => {
        const { type, conversationId } = attachInfo;
        const config = {
            params: {
                type,
                conversationId,
            },
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                callback(percentCompleted);
            },
        };
        return await axios.post(`/messages/files`, formData, config);
    },
    sendFiles: async ({ formData, attachInfo, callback }) => {
        const { type, conversationId } = attachInfo;
        const config = {
            params: {
                type,
                conversationId,
            },
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                callback(percentCompleted);
            },
        };
        return await axios.post(`/messages/multiple/files`, formData, config);
    },
};
