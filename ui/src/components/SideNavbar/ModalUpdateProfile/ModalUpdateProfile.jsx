import { Avatar, Backdrop, Button, Fade, FormControl, IconButton, makeStyles, MenuItem, Modal, Select, TextField } from "@material-ui/core";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { height } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, meSelector, setUser, updateAvatar, updateProfile } from "../../../store/reducers/userReducer/meReducer"
import './modalUpdateProfile.css';
import { PhotoCamera } from "@material-ui/icons";
import { apiUser } from "../../../api/apiUser";
const useStyles = makeStyles((theme) => ({

    paper: {
        width: '350px',
        height: '600px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        borderRadius: '5px',
        boxShadow: theme.shadows[5],

    },
}));
const ModalUpdateProfile = (props) => {
    const profileUser = useSelector(meSelector);
    const disPatch = useDispatch();
    const day = profileUser.birthDay.day;
    const month = profileUser.birthDay.month;
    const year = profileUser.birthDay.year;
    const [birthDay, setBirthDay] = useState()
    const [birthDayStr, setBirthDayStr] = useState('')
    const classes = useStyles();
    const [avatarPre,setAvatarPre] = useState(profileUser.avatar);
    const [avatar1,setAvatar] = useState(profileUser.avatar);
    const [name,setName] = useState(profileUser.name);
    const [gender, setGender] = useState(profileUser.gender? 1: 0);
    useEffect(() => {
        if (month < 10 && day < 10) {
            setBirthDay(`${year}-0${month}-0${day}`);
        }
        if (month < 10 && day > 9) {
            setBirthDay(`${year}-0${month}-${day}`);
        }
        if (month > 9 && day < 10) {
            setBirthDay(`${year}-${month}-0${day}`);
        }
        if (month > 9 && day > 9) {
            setBirthDay(`${year}-${month}-${day}`);
        }
    }, [])
    const handleChangeDate = e => {
        setBirthDay(e.target.value);
        // setBirthDay(new Date(birthDayStr));
     };
     
    const handlePreviewAvatar=(e)=>{
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file);
        setAvatarPre(file.preview);
        setAvatar(file);
    }
    // useEffect(()=>{
    //     avatar && URL.revokeObjectURL(avatar)
    //  },[avatar])

    const [checkUpdate,setCheck] = useState(false);
    const clickToUpdate = async (e)=>{
        e.preventDefault();
        disPatch(
             updateProfile({
                name: name,
                birthDay: birthDay,
                gender: gender
            }),
        )
        const avatar = new FormData();
        avatar.append('file', avatar1);
         console.log("avart", avatar1);
        // await apiUser.updateAvatar(avatar);
        disPatch(
            updateAvatar(avatar)
        )
        setCheck(true)
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className='modal-profile'
            open={props.openUpdate}
            onClose={props.closeUpdate}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.openUpdate} >
                <div className={classes.paper}>
                    <div className='profile-bao'>
                        <h6>Cập nhật thông tin</h6>
                        <button className="btn-close" onClick={props.closeUpdate}></button>
                    </div>
                    <div className='profile-cover'>
                        <img src='https://cover-talk.zadn.vn/default' alt="" />
                    </div>
                    <div className='profile-avatar'>
                        <Avatar
                            style={{ width: '70px', height: '70px', marginLeft:'20px',border: '2px solid white' }}
                            src={avatarPre ? avatarPre : ""}
                        >
                            {avatarPre ? "" : profileUser.name[0].toUpperCase()}
                           
                        </Avatar>
                {/* ///choose file */}
                        <div style={{marginLeft:'-30px',marginTop:'30px'}}>
                            <IconButton color="primary" aria-label="upload picture" component="label">
                                <input accept="image/**" hidden type="file" onChange={handlePreviewAvatar}/>

                                <PhotoCamera />
                            </IconButton>
                        </div>
                    </div>
                    <div className='profile-info-bao'>
                        <p>Tên hiển thị</p>
                        <TextField
                            value={name}
                            size='small'
                            fullWidth
                            variant="outlined"
                            onChange={(e)=>setName(e.target.value)}
                        />
                        
                        <p style={{ fontSize: '12px' }}>Sử dụng tên thật để bạn bè dễ dàng nhận diện hơn</p>

                        <h6 >Thông tin cá nhân</h6>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className='info-gender'>
                                <span >Giới tính</span>
                                <RadioGroup
                                    style={{padding:'10px'}}
                                    row
                                    name="row-radio-buttons-group"
                                    value={
                                        gender
                                    }
                                    onChange={(e)=>setGender(Number(e.target.value))}
                                >
                                    <div style={{ display: 'flex' }}>
                                        <FormControlLabel value={1} control={<Radio />} label="Nam" />
                                        <FormControlLabel value={0} control={<Radio />} label="Nữ" />
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className='info-birth-day'>
                                <span>Ngày sinh</span>
                                <TextField
                                    id="date"
                                    type="date"
                                    onChange={handleChangeDate}
                                    value={birthDay}
                                    sx={{ width: 220 }}
                                    
                                />
                              
                            </div>
                        </div>
                    </div>
                    <div onClick={props.closeUpdate} className="btn-update">
                        <Button onClick={clickToUpdate } style={{ backgroundColor: '#E5E7EB' }} fullWidth={true} variant="outlined">Cập nhật thông tin</Button>
                    </div>
                </div>

            </Fade>
        </Modal>
    )
}
export default ModalUpdateProfile;