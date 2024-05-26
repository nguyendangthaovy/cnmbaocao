import { createContext, useContext, useState } from 'react';
import JWTManager from '../utils/jwt';

const defaultIsAuthenticated = false;

export const AuthContext = createContext({
    isAuthenticated: defaultIsAuthenticated,
    setIsAuthenticatied: () => {},
    checkAuth: () => Promise.resolve(),
    logoutClient: () => {},
});

export const useAuthContext = () => {
    return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticatied] = useState(false);

    const checkAuth = async () => {
        const token = JWTManager.getToken();
        if (token) setIsAuthenticatied(true);
        else {
            const success = await JWTManager.getRefreshToken();
            if (success) setIsAuthenticatied(true);
        }
    };

    const logoutClient = () => {
        JWTManager.deleteToken();
        setIsAuthenticatied(false);
    };

    const authContextData = {
        isAuthenticated,
        checkAuth,
        setIsAuthenticatied,
        logoutClient,
    };

    return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
