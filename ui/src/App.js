import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import { useEffect } from 'react';
// import { checkAuth, checkLogin, login, loginSelector } from './store/reducers/loginReducer/loginSlice';
// import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/login/Login';
import Home from './pages/Home';
import Register from './pages/register/Register';
import { useEffect, useState } from 'react';
import { useAuthContext } from './contexts/AuthContext';
import VideoCall from './pages/videocall/VideoCall';
// import jwt from './utils/jwt';
// import axios from './api/apiConfig';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { initClient } from './utils/socketClient';
function App() {
    const [loading, setLoading] = useState(true);
    const { checkAuth } = useAuthContext();

    useEffect(() => {
        const authenticate = async () => {
            await checkAuth();
            setLoading(false);
        };
        authenticate();
    }, []);
    if (loading) {
        return (
            <div style={{ width: '100%' }}>
                <h1>security ....</h1>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="call/:userId" element={<VideoCall />} />

                <Route path="login" element={<Login />}></Route>
                <Route path="register" element={<Register />}></Route>
            </Routes>
        </div>
    );
}

export default App;
