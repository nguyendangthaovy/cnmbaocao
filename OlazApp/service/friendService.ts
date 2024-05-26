import { httpRequest } from "./../utils/httpRequest";

export const apiFriend = {
  findFriend: async (username: string) => {
    return await httpRequest.get(`/users/search/username/${username}`);
  },
  getFriends: async () => {
    return await httpRequest.get(`/friends`);
  },
  inviteFriend: async (friendId: string) => {
    return await httpRequest.post(`/friends/invites/me/${friendId}`);
  },
  acceptFriend: async (friendId: string) => {
    return await httpRequest.post(`/friends/${friendId}`);
  },
  deleteInvive: async (friendId: string) => {
    return await httpRequest.delete(`/friends/invites/${friendId}`);
  },
  deleteMeInvive: async (friendId: string) => {
    return await httpRequest.delete(`/friends/invites/me/${friendId}`);
  },
  deleteFriend: async (friendId: string) => {
    return await httpRequest.delete(`/friends/${friendId}`);
  },
  getListInvite: async () => {
    return await httpRequest.get(`/friends/invites`);
  },
  getListMeInvite: async () => {
    return await httpRequest.get(`/friends/invites/me`);
  },
};
