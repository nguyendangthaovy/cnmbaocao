import { JwtPayload } from "jsonwebtoken";
import jwtDecode from "jwt-decode";

const JWTManager = () => {
  let inMemoryToken: string | null = null;
  let refreshTokenTimeOutId: number | null = null;
  let userId: string | null = null;

  const getToken = () => inMemoryToken;
  const getUserId = () => userId;

  const setToken = (accessToken: string) => {
    inMemoryToken = accessToken;
    // decode and set countdown to refresh
    const decoded = jwtDecode<JwtPayload & { userId: string }>(accessToken);
    userId = decoded._id;
    setRefreshTokenTimeOut((decoded.exp as number) - (decoded.iat as number));
    return true;
  };

  const abortRefresgToken = () => {
    if (refreshTokenTimeOutId)
      window.clearTimeout(refreshTokenTimeOutId as number);
  };

  const setRefreshTokenTimeOut = (delay: number) => {
    //5s before token expried
    refreshTokenTimeOutId = window.setTimeout(
      getRefreshToken,
      delay * 1000 - 5000
    );
  };

  const deleteToken = () => {
    inMemoryToken = null;
    abortRefresgToken();
    return true;
  };

  const getRefreshToken = async () => {
    try {
      const response = await fetch("http://localhost:4000/refresh_token", {
        credentials: "include",
      });

      const data = (await response.json()) as {
        success: boolean;
        accessToken: string;
      };

      setToken(data.accessToken);
      return true;
    } catch (error) {
      console.log("UNAUTHENTICATED", error);
      deleteToken();
      return false;
    }
  };

  return { getToken, setToken, getRefreshToken, deleteToken, getUserId };
};

export default JWTManager();
