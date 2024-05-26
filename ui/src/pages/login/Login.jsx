import './login.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isRegister, login, loginSelector } from '../../store/reducers/loginReducer/loginSlice';
import { useAuthContext } from '../../contexts/AuthContext';
import jwt from '../../utils/jwt';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLogin } = useSelector(loginSelector);
    const [isError, setIsError] = useState(false);
    jwt.getUserId();
    useEffect(() => {
        console.log(jwt.getUserId());
        if (jwt.getUserId())
            // navigate('..');
            window.location.href = '/';
    }, [jwt.getUserId()]);

    const clickToFormRegister = (e) => {
        e.preventDefault();
        dispatch(isRegister(true));
        if (!Boolean(localStorage.getItem('isLogin') === 'true')) navigate('../register');
    };
    const onLogin = (e) => {
        e.preventDefault();
        dispatch(login({ username, password }));
        setIsError(!isLogin);
        if (isLogin) window.location.href = '/';
        // if (isLogin) navigate('..');
    };
    return (
        <div className="Auth-form-container loginContainer ">
            <form className="Auth-form" onSubmit={onLogin}>
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Olaz</h3>

                    <div className="form-group mt-3">
                        <label>Số điện thoại</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            className="form-control mt-1"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Mật khẩu</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                        />
                    </div>
                    <p className={isError ? 'error notifyError' : 'notifyError'}>
                        * thông tin tài khoản hoặc mật khẩu không chính xác
                    </p>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Đăng nhập
                        </button>
                    </div>
                    <p className="option-login text-right mt-2">
                        <span>
                            <Link to="forgot-password">Quên mật khẩu?</Link>
                        </span>
                        <span>
                            <Link onClick={clickToFormRegister} to="../register">
                                Tạo tài khoản mới?
                            </Link>
                        </span>
                    </p>
                </div>
            </form>
            )
        </div>
    );
};

export default Login;
