import { Avatar, Backdrop, Button, Fade, makeStyles, Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiUser } from "../../../api/apiUser";
import { getProfile, meSelector } from "../../../store/reducers/userReducer/meReducer"
import ModalUpdateProfile from "../ModalUpdateProfile/ModalUpdateProfile";
import './modalProfile.css';
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
const ModalProfile = (props) => {
    
    const profileUser = useSelector(meSelector);
    const [name,setName]= useState();
    const [birthDay,setBirthDay]= useState();
    const [gender,setGender]= useState();
    const openProfile = props.openProfilee;
    const classes = useStyles();
    const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

    const handleOpenUpdateProfile = async()=>{
        setOpenUpdateProfile(true);
    }

    const handleCloseUpdateProfile = async()=>{
        const rs = await apiUser.getProfile();
        const userNew = rs.data;
        console.log("new update", userNew);
        setName(userNew.name);
        setBirthDay(userNew.birthDay);
        setGender(userNew.gender);
        setOpenUpdateProfile(false);
        console.log(profileUser.name);
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className='modal-profile'
            open={openProfile}
            onClose={props.closeProfile}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}

        >
            <Fade in={openProfile}>
                {profileUser &&
                    <div className={classes.paper}>


                        <div className='profile-bao'>
                            <div>
                                <h6>Thông tin tài khoản</h6>
                            </div>
                            <div>
                                <button className="btn-close" onClick={props.closeProfile}></button>
                            </div>
                            
                        </div>
                        <div className='profile-cover'>
                            <img src='https://cover-talk.zadn.vn/default' alt="" />
                        </div>
                        <div className='profile-avatar'>
                            <Avatar
                                style={{ width: '70px', height: '70px', border: '2px solid white' }}
                                src={profileUser.avatar ? profileUser.avatar : ""}>
                                {profileUser.avatar ? "" : profileUser.name[0].toUpperCase()}
                            </Avatar>
                        </div>
                        <div className='profile-info-bao'>
                            <h5 >{name? name: profileUser.name}</h5>
                            <h6 >Thông tin cá nhân</h6>
                            <div style={{ display: 'flex' }}>
                                <div className='info-left'>
                                    <p >Điện thoại</p>
                                    <p >Giới tính</p>
                                    <p>Ngày sinh</p>
                                </div>

                                <div className='info-right'>
                                    <p>{profileUser.username}</p>
                                    <p>
                                        {
                                        
                                        profileUser.gender ? "Nam" : "Nữ"
                                        
                                        }</p>
                                    <p>
                                        {
                                            birthDay
                                            ?`${birthDay.day} / ${birthDay.month} / ${birthDay.year}`
                                            : `${profileUser.birthDay.day} / ${profileUser.birthDay.month} / ${profileUser.birthDay.year}`
                                    
                                        }   
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="btn-go-update">
                            <Button onClick={handleOpenUpdateProfile} style={{ backgroundColor: '#E5E7EB' }} fullWidth={true} variant="outlined">
                                Cập nhật thông tin
                            </Button>
                            <ModalUpdateProfile openUpdate={openUpdateProfile} closeUpdate={handleCloseUpdateProfile} />
                        </div>
                    </div>
                    }

            </Fade>
        </Modal>
    )
}
export default ModalProfile;