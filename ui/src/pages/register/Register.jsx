import './register.css';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginSelector } from '../../store/reducers/loginReducer/loginSlice';
import { checkPhone } from '../../utils/checkPhoneValid';
import { useAuthContext } from '../../contexts/AuthContext';
import jwt from '../../utils/jwt';
import { apiRegister } from '../../api/apiRegister';
import { apiUser } from '../../api/apiUser';
import Timer from './CountDown';
import { Avatar, FormControlLabel, IconButton, Radio, RadioGroup } from "@mui/material";
import CountDown from './CountDown';
import { getProfile, meSelector } from '../../store/reducers/userReducer/meReducer';
import { PhotoCamera } from '@material-ui/icons';


const Register = () => {
    const { isAuthenticated } = useAuthContext();
    const char = "!@#$&*%^&().?<>'";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin } = useSelector(loginSelector);
    const RESEND_OTP_TIME_LIMIT = 60;
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('Chưa đặt tên');
    const birthRef = useRef();
    const [birthDayStr, setBirthDayStr] = useState('');
    const [birthDay, setBirthDay] = useState('1999-01-01');
    const [gender, setGender] = useState(Number(0));
    const [step, setStep] = useState('FORM_REGISTER');
    const [checkDis, setDis] = useState(false)
    const SECOUNDS_OTP = 60;
    const check0 = useRef();
    const check1 = useRef();
    const check2 = useRef();
    const check3 = useRef();
    const check4 = useRef();
    const check5 = useRef();
    const check6 = useRef();
    const checkOtp = useRef();
    const checkCountOtp = useRef();
    const checkPass = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
    let conditional = false;
    const [waitResetOtp,setWaitRestOtp] = useState(false);
    // useEffect(() => {
    //     if (jwt.getUserId()) navigate('..');
    // }, [jwt.getUserId()]);

    useEffect(() => {
        check0.current.className = 'catchError hide';
        if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(username)) {
            check1.current.className = 'catchError error';
            conditional = false;
        } else {
            check1.current.className = 'catchError active';
            conditional = true;
        }

        if (!/^(?=.*[!@#$&*%^&().?<>'])(?=.*[0-9]).{1,}$/.test(password)) {
            check2.current.className = 'catchError error';
            conditional = false;
        } else {
            check2.current.className = 'catchError active';
            conditional = true;
        }

        if (!/^(?=.*[A-Z]).{1,}$/.test(password)) {
            check3.current.className = 'catchError error';
            conditional = false;
        } else {
            check3.current.className = 'catchError active';
            conditional = true;
        }
        if (!/^(?=.*[a-z]).{1,}$/.test(password)) {
            check4.current.className = 'catchError error';
            conditional = false;
        } else {
            check4.current.className = 'catchError active';
            conditional = true;
        }

        if (!/.{8,16}$/.test(password)) {
            check5.current.className = 'catchError error';
            conditional = false;
        } else {
            check5.current.className = 'catchError active';
            conditional = true;
        }

        if (!(password === confirmPassword) || password === '') {
            check6.current.className = 'catchError error';
            conditional = false;
        } else {
            check6.current.className = 'catchError active';
            conditional = true;
        }
    }, [username, password, confirmPassword]);

    // const name = "Chưa đặt tên"
    const [otpDb, setOtpDB] = useState();
    // const [user, setUser] = useState(null);
    const [checksubmit, setSubmit] = useState(false);
    const [countOtp, setCountOtp] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [avatarPre,setAvatarPre] = useState();
    const [avatar1,setAvatar] = useState();
    // const onLogin = (e) => {
    //     e.preventDefault();
    //     dispatch(login({ username, password }));
    //     if (isLogin) navigate('..');
    // };
    const handlePreviewAvatar=(e)=>{
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file);
        setAvatarPre(file.preview);
        setAvatar(file);
    }
    const onSubmit = async (e) => {
        setSubmit(true);
        e.preventDefault();
        if (step === 'FORM_REGISTER') {
            if (conditional) {
                try {
                    const regis = await apiRegister.register({ name, username, password })
                    if (regis.config.data) {
                        setStep('FORM_OTP');
                        setTimeLeft(60);
                        setDis(false)
                    }
                } catch (error) {
                    const account = await apiUser.getUserByUserName({ username });
                    if (account.data.isActived) {
                        alert(`Số điện thoại ${username} đã được kích hoạt vui lòng đăng ký tài khoản khác`)
                    } else {
                        apiRegister.resetOtp({ username });
                        setStep('FORM_OTP');
                        setTimeLeft(60);
                        setDis(false)
                    }
                }
            };
        }
        if (step === 'FORM_OTP') {
            checkOtp.current.className = 'catchError hide';
            try {
                const confirm = await apiRegister.confirm({ username, otp })
                const account = await apiUser.getUserByUserName({ username });
                if (account.data.isActived === true) {
                    dispatch(login({ username, password }));
                    setDis(true)
                    setTimeout(async () => {
                        // const user = await apiUser.getProfile();
                        setStep('FORM_INFO');
                        setDis(false)
                    }, 1500);
                }
            } catch (error) {
                // apiRegister.resetOtp({ username });
                setCountOtp(countOtp + 1);
                // console.log("wrong otp")
                // console.log(countOtp)
                checkOtp.current.className = 'catchError error';
                if (countOtp > 3) {
                    checkOtp.current.className = 'catchError hide';
                    checkCountOtp.current.className = 'catchError error';
                    setDis(true)
                }
            }
        }
        if (step === 'FORM_INFO') {
            // console.log(`name: ${name} birth: ${birthDay} gender: ${gender}`);
            // console.log("type birh", typeof birthDay)

            await apiUser.updateProfile({ name, birthDay, gender })
            const avatar = new FormData();
            if(avatar1){
                avatar.append('file', avatar1);
                await apiUser.updateAvatar(avatar);
            }
            navigate('..');
        }

    };
    useEffect(() => {
        // if (!timeLeft) return;
        const intervalId = setInterval(async () => {
            if (timeLeft === 0) {
                setDis(true)
                // await apiRegister.resetOtp({username});
                // setTimeLeft(60);
            }
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);

            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);
    const handleResentOTP = async (e) => {
        e.preventDefault();
        setOtp('');
        checkOtp.current.className = 'catchError hide';
        checkCountOtp.current.className = 'catchError hide';
        setDis(false);
        setTimeLeft(60);
        await apiRegister.resetOtp({ username });
        alert(`Mã OTP đã được gửi lại vào số ${username}`)
        setWaitRestOtp(true);
        setTimeout(() => {
            setWaitRestOtp(false);
        }, 70000);
    }

    const clickToFormLogin = (e) => {
        e.preventDefault();
        dispatch(login({ isLogin: false, isRegister: false }));
        navigate('../login');
    };

    const clickToFormRegiser = (e) => {
        e.preventDefault();
        setStep('FORM_REGISTER');
    };
    return (
        <div className="Auth-form-container loginContainer ">
            {step === 'FORM_REGISTER' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Olaz</h3>
                        <div className="form-group mt-3">
                            <label>Số điện thoại</label>
                            <input
                                value={username}
                                name="username"
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
                        <div className="form-group mt-3">
                            <label>Xác nhận lại mật khẩu</label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirm password"
                            />
                        </div>

                        <div className="form-group pt-3 pb-3 zone-error">
                            <p ref={check0} style={{ color: 'red' }} className="catchError hide">
                                {' '}
                                * số điện thoại không tồn tại
                            </p>
                            <p ref={check1} className="catchError">
                                {' '}
                                * số điện thoại chỉ bao gồm số (10 chữ số ex: 0123456789)
                            </p>
                            <p ref={check2} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự đặc biệt và số `${char}`
                            </p>
                            <p ref={check3} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự chữ in hoa
                            </p>
                            <p ref={check4} className="catchError">
                                {' '}
                                * mật khẩu có chứa ít nhất 1 ký tự chữ thường
                            </p>
                            <p ref={check5} className="catchError">
                                {' '}
                                * mật khẩu có độ dài từ 8-16 ký tự
                            </p>
                            <p ref={check6} className="catchError">
                                {' '}
                                * xác nhận mật khẩu phải trùng khớp
                            </p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Tiếp
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <a href="fb.com">Quên mật khẩu</a>
                            </span>
                            <span>
                                <Link onClick={clickToFormLogin} to="../login">
                                    Đã có tài khoản ?
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_OTP' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="">Xác nhận OTP</h4>
                        {/* <CountDown username={username} secounds={SECOUNDS_OTP} /> */}
                        <h4>{timeLeft}</h4>
                        <div className="form-group mt-3">
                            <label>{`OTTTP:`}</label>
                            <div style={{ display: 'flex' }}>
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="OTP gồm 6 chữ số"
                                />
                                <button disabled={waitResetOtp} onClick={handleResentOTP} style={{ height: '38px', marginTop: '4px' }} className="btn btn-primary">
                                    <RestartAltIcon fontSize='medium' />
                                </button>
                            </div>

                        </div>

                        <div className="form-group pt-3 pb-3">
                            <p ref={checkOtp} className="catchError hide"> OTP không chính xác hoặc đã hết hạn</p>
                            <p ref={checkCountOtp} className="catchError hide"> Vượt quá số lần nhập, yêu cầu gửi lại mã</p>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button id='submit' disabled={checkDis} type="submit" className="btn btn-primary">
                                Xác nhận
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            <span>
                                <Link onClick={clickToFormRegiser} to="../register">
                                    Trở lại
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            )}
            {step === 'FORM_INFO' && (
                <form className="Auth-form" onSubmit={onSubmit}>
                    <div className="Auth-form-content">
                        <h4 className="" style={{marginBottom:'50px'}}>xác nhận thông tin tài khoản</h4>
                        <div className='profile-avatar'>
                            <Avatar
                                style={{ width: '120px', height: '120px', marginLeft:'20px',border: '2px solid white' }}
                                src={avatarPre ? avatarPre : ""}
                            >
                                ?

                            </Avatar>
                            {/* ///choose file */}
                            <div style={{ marginLeft: '-30px', marginTop: '80px' }}>
                                <IconButton color="primary" aria-label="upload picture" component="label">
                                    <input accept="image/**" hidden type="file" onChange={handlePreviewAvatar} />

                                    <PhotoCamera />
                                </IconButton>
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label>Tên</label>
                            <input type="text" name='name' onChange={(e) => setName(e.target.value)} className="form-control mt-1" placeholder="Tên người dùng" />
                        </div>

                        <div className="form-group mt-3">
                            <label>Giới tính</label>
                            <RadioGroup
                                style={{ padding: '10px' }}
                                row
                                name="row-radio-buttons-group"
                                value={
                                    gender
                                }

                                onChange={(e) => setGender(Number(e.target.value))}
                            >
                                <div style={{ display: 'flex' }}>
                                    <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                    <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                                </div>
                            </RadioGroup>

                        </div>
                        <div className="form-group mt-3">
                            <label>Ngày sinh</label>
                            <input type="date" name='birthDay'
                                value={birthDay}
                                ref={birthRef} id="birtDay"
                                onChange={(e) => {
                                    const birth = e.target.value;
                                    setBirthDay(birth);
                                }}


                                className="form-control mt-1" />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary">
                                Hoàn thành
                            </button>
                        </div>
                        <p className="option-login text-right mt-2">
                            {/* <span>
                                <Link to="../login">Trở lại</Link>
                            </span> */}
                        </p>
                    </div>
                </form>
            )}

        </div>
    );
};

export default Register;
