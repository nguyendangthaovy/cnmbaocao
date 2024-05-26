import axios from './apiConfig';

export const apiConversations = {
    getList: async (name, type = 0) => {
        return await axios.get('/conversations', {
            params: {
                name: name ? name : '',
                type,
            },
        });
    },
    getConversationById: async (id) => {
        return await axios.get(`/conversations/${id}`);
    },
    createGroupConversation: async ({ name, userIds }) => {
        return await axios.post(`/conversations/new/groups`, { name, userIds });
    },
    getLastViewOfMembers: async (conversationId) => {
        return await axios.get(`/conversations/${conversationId}/last-view`);
    },
    getListMember: async (conversationId) => {
        return await axios.get(`/conversations/${conversationId}/members`);
    },
    addMember: async ({ conversationId, userIds }) => {
        return await axios.post(`/conversations/${conversationId}/members`, {
            userIds,
        });
    },
    removeMember: async ({ conversationId, userId }) => {
        return await axios.delete(`/conversations/${conversationId}/members/${userId}`);
       
    },
    leaveGroup: async (conversationId) => {
        return await axios.delete(`/conversations/${conversationId}/members/leave`);
    },
    addManager: async ({ conversationId, managerIds }) => {
        return await axios.post(`/conversations/${conversationId}/managers`, {
            managerIds,
        });
    },
    deleteManager: async ({ conversationId, managerIds }) => {
        return await axios.delete(`/conversations/${conversationId}/managers`, {
            data: {
                managerIds: managerIds,
            },
        });
    },
    reNameConversation: async({conversationId,name})=>{
          await axios.patch(`/conversations/${conversationId}/name`,{name})
         return await axios.get(`/conversations/${conversationId}`);
    },
    deleteConversation: async({conversationId})=>{
       return await axios.delete(`/conversations/${conversationId}`) 
    },
    deleteAllChatInConversation: async({conversationId})=>{
        return await axios.delete(`/conversations/${conversationId}/messages`) 
     },
    
  
};
