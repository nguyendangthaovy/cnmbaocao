import { Avatar, Backdrop, Button, Fade, makeStyles, Modal } from "@material-ui/core";
import { Api } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiFriend } from "../../../api/apiFriend";
import { conversationSelector, getListMembers, setCurrentConversation } from "../../../store/reducers/conversationReducer/conversationSlice";
import { deleteFriendAsync, findFriend, friendSelector, inviteFriend, listFriendInviteSelector, listFriendMeInviteSelector, listFriendSelector, setEmptyFriend } from "../../../store/reducers/friendReducer/friendReducer";
import { getMessages } from "../../../store/reducers/messageReducer/messageSlice";

import { meSelector } from "../../../store/reducers/userReducer/meReducer"
import jwt from "../../../utils/jwt";
import '../../SideNavbar/ModalProfile/modalProfile.css';
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
const ButtonAddOrDeleteFriend = (props) => {
    // const result = useSelector(friendSelector)
    const listFriend = useSelector(listFriendSelector);
    const listMeInvite = useSelector(listFriendMeInviteSelector);
    const listInvite = useSelector(listFriendInviteSelector);
    const profile = props.profile
    const dispatch = useDispatch();
    const [buttonSwap,setButtonSwap]=useState('Kết bạn');
    // console.log(listFriend.length)
    const handleDeleteFriend = (e) => {
        e.preventDefault()
        if (profile) {
            const id = profile._id;
            dispatch(deleteFriendAsync(id))

        } else
            console.log("delete fail")

    };
    // useEffect(async()=>{
    //     const username = profile.username
    //     const resultApi = await apiFriend.findFriend(username)
    //     const result = resultApi.data
    //     const findFriendMeInvited = listMeInvite.find((friend)=>friend._id === result._id) 
    //     const findFriendInvited = listInvite.find((friend)=>friend._id === result._id) 
    //     if(findFriendMeInvited){
    //         setButtonSwap('Hủy lời mời')
    //     }else if(findFriendInvited){
    //         setButtonSwap('Chấp nhận')
    //     }
    // },[buttonSwap])
    const onClickInvite = async() => {
        try {
            if (profile){
                const username = profile.username
                const resultApi = await apiFriend.findFriend(username)
                const result = resultApi.data
                //     alert("không thể kết bạn")
                // else
                setTimeout(() => {
                    if(result._id){
                        dispatch(inviteFriend(result));
                        dispatch(setEmptyFriend());
                    }else
                        alert("không thể kết bạn")
                }, 1000);
            }
        } catch (error) {
            alert("không thể kết bạn")
        }
    };
    const check = listFriend.some((friend) => {
        // console.log("profile", profile.username)
        // console.log("friend", friend.username)
        if (friend.username === profile.username)
            return true;
        return false;
    })
    if (check)
        return (
            <Button onClick={handleDeleteFriend} style={{ backgroundColor: '#f32c2c', color: 'white' }} fullWidth={true} >
                <DeleteIcon /> Hủy kết bạn
            </Button>
        )
    return (
        <Button onClick={onClickInvite} style={{ backgroundColor: '#2c75f3', color: 'white' }} fullWidth={true} >
            {buttonSwap}
        </Button>
    )
}
const ModalProfileFriend = (props) => {
    const listConvers = useSelector(conversationSelector);
    const dispatch = useDispatch();
    const profileUser = props.friend;
    const userId = jwt.getUserId();
    const listFriend = useSelector(listFriendSelector);
    const [listF, setListF] = useState();
    const [name, setName] = useState();
    const [birthDay, setBirthDay] = useState();
    const [gender, setGender] = useState();
    const openProfile = props.openProfilee;
    const classes = useStyles();
    // useEffect(() => {
    //     if (listFriend) setListF(listFriend);
    // }, [listFriend]);
    const handeleMess = () => {
        try {
            if (listConvers) {
                const chatOnes = listConvers.filter((conver) => !conver.type && conver.name === profileUser.name)
                const conver = chatOnes[0]
                dispatch(setCurrentConversation(conver));
                dispatch(getMessages({ id: conver._id }));
                dispatch(getListMembers({ conversationId: conver._id }));
            }
        } catch (error) {
            alert("chưa kết bạn không thể nhắn tin")
        }
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
                            <h5 >{name ? name : profileUser.name}</h5>
                            <h6 >Thông tin cá nhân</h6>
                            <div style={{ display: 'flex' }}>
                                <div className='info-left'>
                                    <p >Điện thoại</p>
                                    <p >Giới tính</p>
                                    <p>Ngày sinh</p>
                                </div>

                                <div className='info-right'>
                                    {/* <p>{profileUser.username}</p> */}
                                    <p>***********</p>
                                    <p>
                                        {

                                            profileUser.gender ? "Nam" : "Nữ"

                                        }</p>
                                    <p>
                                        **/**/****
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="btn-go-update">
                            <ButtonAddOrDeleteFriend profile={profileUser} />
                            <Button style={{ backgroundColor: '#E5E7EB' }} fullWidth={true} onClick={handeleMess}>
                                Nhắn tin
                            </Button>

                        </div>
                    </div>
                }

            </Fade>
        </Modal>
    )
}
export default ModalProfileFriend;