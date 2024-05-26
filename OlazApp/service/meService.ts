import { httpRequest } from "./../utils/httpRequest";

const meApi = {
  fetchProfile: () => {
    return httpRequest.get(`/m/profile`);
  },

  updateAvatar: (image: any) => {
    return httpRequest.patch("/m/avatar", image);
  },

  updateProfile: ({
    name,
    gender,
    dateOfBirth,
  }: {
    name: string;
    gender: any;
    dateOfBirth: any;
  }) => {
    return httpRequest.put("/m/profile", { name, dateOfBirth, gender });
  },
};

export default meApi;
