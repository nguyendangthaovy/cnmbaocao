import axios from 'axios';
import jwt from '../utils/jwt';

const instance = axios.create({
    // baseURL: 'http://localhost:4000',
    baseURL: String(process.env.REACT_APP_API_URL),

    headers: {
        'content-type': 'application/json',
    },
});

instance.defaults.headers.common['Authorization'] = `Bearer ${jwt.getToken()}`;

instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${jwt.getToken()}`;
    return config;
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        axios.interceptors.response.eject(instance.interceptors);

        return axios
            .get('http://localhost:4000/refresh_token', {
                headers: {
                    Authorization: `Bearer ${jwt.getToken()}`,
                },
                withCredentials: true,
            })
            .then((response) => jwt.setToken(response.data.accessToken))
            .catch((error) => {
                jwt.deleteToken();
                return Promise.reject(error);
            })
            .finally();
    },
);

export default instance;
