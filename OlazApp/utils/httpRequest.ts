import { BASE_URL } from "@env";
import axios from "axios";
import jwt from "./jwt";

export const httpRequest = axios.create({
  baseURL: BASE_URL,
});

export const configAxios = () => {
  httpRequest.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${jwt.getToken()}`;
};

export default httpRequest;
