import httpRequest from "../utils/httpRequest";

export const login = async (username: string, password: string) => {
  try {
    return await httpRequest.post(
      "auth/login",
      { username, password },
      { withCredentials: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const registry = async (
  name: string,
  username: string,
  password: string
) => {
  return await httpRequest.post(
    "auth/registry",
    { name, username, password },
    { withCredentials: true }
  );
};

export const logout = async () => {
  try {
    const res = await httpRequest.post(
      "auth/logout",
      {},
      { withCredentials: true }
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (username: string) => {
  console.log(username);
  const res = await httpRequest.get(`auth/users/${username}`);
  return res.data;
};

export const confirmAccount = async (account: {
  username: string;
  otp: string;
}) => {
  return httpRequest.post("auth/confirm", account);
};

export const resetOTP = async (username: string) => {
  return httpRequest.post("auth/reset-otp", { username });
};

// export default authService
