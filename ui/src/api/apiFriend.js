import axios from './apiConfig';
export const apiFriend = {
    findFriend: async (username) => {
        return await axios.get(`/users/search/username/${username}`);
    },
    findFriendById: async (userId) => {
        return await axios.get(`/users/search/id/${userId}`);
    },
    getFriends: async () => {
        return await axios.get(`/friends`);
    },
    inviteFriend: async (friendId) => {
        return await axios.post(`/friends/invites/me/${friendId}`);
    },
    acceptFriend: async (friendId) => {
        return await axios.post(`/friends/${friendId}`);
    },
    deleteInvive: async (friendId) => {
        return await axios.delete(`/friends/invites/${friendId}`);
    },
    deleteMeInvite: async (friendId) => {
        return await axios.delete(`/friends/invites/me/${friendId}`);
    },
    deleteFriend: async (friendId) => {
        return await axios.delete(`/friends/${friendId}`);
    },
    getListInvite: async () => {
        return await axios.get(`/friends/invites`);
    },
    getListMeInvite: async () => {
        return await axios.get(`/friends/invites/me`);
    },
};
