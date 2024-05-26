import { httpRequest } from './../utils/httpRequest';

const userApi = {
    fetchUsers: async( username : string )=> {
      return httpRequest.get(`/users/search/username/${username}`);
    },
    fetchUserById: async(userId : string)  => {
      return httpRequest.get(`/users/search/id/${userId}`);
    },
  };
  
  export default userApi;