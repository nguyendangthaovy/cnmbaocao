import jwtDecode from 'jwt-decode';

const JWTManager = () => {
    let inMemoryToken = null;
    let refreshTokenTimeOutId;
    let userId = '';

    const getToken = () => inMemoryToken;
    const getUserId = () => userId;

    const setToken = (accessToken) => {
        inMemoryToken = accessToken;
        // decode and set countdown to refresh
        const decoded = jwtDecode(accessToken);
        userId = decoded._id;
        setRefreshTokenTimeOut(Number(decoded.exp) - Number(decoded.iat));
        localStorage.setItem('isLogin', true);
        return true;
    };

    const abortRefreshToken = () => {
        if (refreshTokenTimeOutId) window.clearTimeout(refreshTokenTimeOutId);
    };

    const setRefreshTokenTimeOut = (delay) => {
        //5s before token expried
        refreshTokenTimeOutId = window.setTimeout(getRefreshToken, delay * 1000 - 5000);
    };

    const deleteToken = () => {
        inMemoryToken = null;
        abortRefreshToken();
        localStorage.setItem('isLogin', false);
        return true;
    };

    const getRefreshToken = async () => {
        try {
            const response = await fetch('http://localhost:4000/refresh_token', {
                credentials: 'include',
            });

            const data = await response.json();
            setToken(data.accessToken);
            return true;
        } catch (error) {
            console.log('UNAUTHENTICATED', error);
            deleteToken();
            return false;
        }
    };

    return { getToken, setToken, getRefreshToken, deleteToken, getUserId };
};

export default JWTManager();
