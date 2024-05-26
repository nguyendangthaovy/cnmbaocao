import MyChat from '../components/MyChat/MyChat';
import SideNavbar from '../components/SideNavbar/SideNavbar';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ChattingPage from './chatting/ChattingPage';
import { initClient, socket } from '../utils/socketClient';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../store/reducers/loginReducer/loginSlice';
import {
    addManager,
    addManager1,
    addNewConversation,
    conversationSelector,
    currentConversationSelector,
    deleteGroup,
    getConversationById,
    getList,
    getListMembers,
    removeGroupWhenBeKick,
    removeManager,
    removeManager1,
    reNameGroup,
    setLastMessageInConversation,
    updateAvatarWhenUpdateMember,
} from '../store/reducers/conversationReducer/conversationSlice';
import { handleRenameGroup, rerenderMessage } from '../store/reducers/messageReducer/messageSlice';
import useWindowUnloadEffect from '../hooks/useWindowUnloadEffect';
import { useAuthContext } from '../contexts/AuthContext';
import jwt from '../utils/jwt';
import { Outlet, useNavigate } from 'react-router-dom';
import { getProfile, meSelector } from '../store/reducers/userReducer/meReducer';
import {
    deleteFriend,
    deleteInvite,
    deleteMeInvite,
    findFriend,
    getFriends,
    getListInvite,
    getListMeInvite,
    recieveInvite,

    setNewFriend,
} from '../store/reducers/friendReducer/friendReducer';
import { apiConversations } from '../api/apiConversation';
import { useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Avatar, Backdrop, Button, Fade, makeStyles, Modal } from '@material-ui/core';
import './home.css'
let idCall = null;
const useStyles = makeStyles((theme) => ({
    paper: {
        width: '350px',
        height: '600px',
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: '#5a78f1',
        border: 'none',
        borderRadius: '5px',
        boxShadow: theme.shadows[5],

    },
}));
const Home = () => {
    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const { isLogin } = useSelector(loginSelector);
    const conversations = useSelector(conversationSelector);
    const currentConver = useSelector(currentConversationSelector);
    const navigate = useNavigate();
    const answerBtnRef = useRef();

    useEffect(() => {
        if (!jwt.getUserId()) navigate('login');
    }, [jwt.getUserId()]);

    useEffect(() => {
        if (!jwt.getUserId()) return;
        dispatch(getProfile());
        dispatch(getList({}));
        dispatch(getFriends());
        dispatch(getListInvite());
        dispatch(getListMeInvite());
    }, []);

    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        const userId = jwt.getUserId();
        if (userId) socket.emit('join', userId);
    }, [jwt.getUserId()]);

    useEffect(() => {
        if (conversations.length === 0) return;
        // console.log('join join join');
        const conversationIds = conversations.map((conversation) => conversation._id);
        socket.emit('join-conversations', conversationIds);
    }, [conversations]);

    useEffect(() => {
        socket.on('create-individual-conversation', (converId) => {
            socket.emit('join-conversation', converId);
            dispatch(getConversationById(converId));
        });
    }, []);

    useEffect(() => {
        socket.on('create-individual-conversation-when-was-friend', (conversationId) => {
            dispatch(getConversationById(conversationId));
        });
    }, []);

    useEffect(() => {
        socket.on('new-message', (conversationId, message) => {
            if (jwt.getUserId() !== message.user._id) dispatch(rerenderMessage(message));

            dispatch(setLastMessageInConversation({ conversationId, message }));
        });
        socket.on('new-message-group', (conversationId, message) => {
            dispatch(rerenderMessage(message));

            dispatch(setLastMessageInConversation({ conversationId, message }));
        });
        socket.on('create-conversation', (conversationId) => {
            dispatch(getConversationById(conversationId));
        });
    }, []);

    useEffect(() => {
        socket.on('has-change-conversation-when-have-new-message', (conversationId, message) => {
            dispatch(setLastMessageInConversation({ conversationId, message }));
        });
    }, []);

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    useWindowUnloadEffect(async () => {
        async function leaveApp() {
            socket.emit('leave', jwt.getUserId());
            await sleep(2000);
        }

        await leaveApp();
    }, true);

    useEffect(() => {
        socket.on('accept-friend', (value) => {
            dispatch(setNewFriend(value._id));
            dispatch(deleteMeInvite(value._id))
            // dispatch(setMyRequestFriend(value._id));
        });

        socket.on('send-friend-invite', (fq) => {
            console.log('recieved friend invite', fq);
            dispatch(recieveInvite(fq));
            // dispatch(setAmountNotify(amountNotify + 1));
        });

        // xóa lời mời kết bạn
        socket.on('deleted-friend-invite', (_id) => {
            dispatch(deleteMeInvite(_id))
        });

        //  xóa gởi lời mời kết bạn cho người khác
        socket.on('deleted-invite-was-send', (_id) => {
            dispatch(deleteInvite(_id));
        });

        // xóa kết bạn
        socket.on('deleted-friend', (_id) => {
             dispatch(deleteFriend(_id));
    
            // dispatch(updateFriendChat(_id));
        });
        // thêm phó nhóm
        socket.on('add-managers', ({ conversationId, managerIds }) => {
            dispatch(addManager1({ conversationId, managerIds }));
        });

        socket.on('delete-managers', ({ conversationId, managerIds }) => {
            dispatch(removeManager1({ conversationId, managerIds }));
        });
        socket.on('deleted-group', async (id) => {
            // const data = await apiConversations.getConversationById(id);
            // const conver = data.data
            socket.emit('member-leave-group', id);
             dispatch(removeGroupWhenBeKick(id))
             
             
        });
        socket.on('delete-conversation', async (id) => {
            // const data = await apiConversations.getConversationById(id);
            // const conver = data.data
            // socket.emit('member-leave-group', id);
             dispatch(deleteGroup(id))
        });
        socket.on('update-member', async (conversationId) => {
            dispatch(handleRenameGroup())
            const data = await apiConversations.getConversationById(conversationId);
            const conver = data.data
            console.log("azzz",conver)
            dispatch(
                updateAvatarWhenUpdateMember({
                    conver
                }),
            );
            
        });
        socket.on('notify-call', (myId) => {
            idCall = myId;
            answerBtnRef.current.classList.remove('hideCall');
            console.log('notify call');

            try {
                setTimeout(() => {
                    if (answerBtnRef.current.classList) {
                        answerBtnRef.current.classList.add('hideCall');
                        handleOpenModalCall()
                    }
                }, 5000);
            } catch (error) { }
        });
        socket.on('added-group', async (id) => {
            console.log('added group');
            const {data} = await apiConversations.getConversationById(id);
            if (data) {
                dispatch(addNewConversation(data));
            }
        });
        
    }, []);

    useEffect(()=> {
        socket.on("rename-conversation", (id, name, message)=>{
            dispatch(setLastMessageInConversation({conversationId: id, message}));
            dispatch(reNameGroup({id, name}))
            console.log("ABVC", id, currentConver);
            if(currentConver === id){
                dispatch(rerenderMessage(message));
            }
        })
    },[currentConver])

    const handleAnswer = () => {
        if (idCall) {
            // navigate(`/call/accept`);

            socket.emit('answer-call', idCall);

            window.open('/call/accept', '_blank');
            setOpenModal(false);
        }
    };
    const handleOpenModalCall = () => {
        setOpenModal(true);
    };
    const handleCloseModalCall = () => {
        setOpenModal(false);
    };
    return (
        <div className="home">
            <SideNavbar style={{ flex: 1 }} />
            <MyChat socket={socket}></MyChat>
            <ChattingPage socket={socket} />
            <div ref={answerBtnRef} className="hideCall">
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className='modal-profile'
                    open={openModal}
                    // onClose={handleCloseModalCall}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}

                >
                    <Fade in={openModal}>
                        <div className={classes.paper}>
                            <div className='calling-bao'>
                                <div>

                                </div>
                                <div className='avatar-call-bao'>
                                    <div>
                                        <Avatar
                                            style={{ width: '70px', height: '70px', border: '2px solid white' }}
                                            src={''}>
                                            ?
                                        </Avatar>
                                    </div>
                                    <div>
                                        <h5 style={{ color: 'white' }}>Ai đang gọi...</h5>
                                    </div>
                                </div>

                                <div className="btn-action">
                                    <div className='btn-dis-call-bao'>
                                        <Button
                                            className="btn-dis-call"
                                            style={{ backgroundColor: '#f5261b' }}
                                            onClick={handleCloseModalCall}>
                                            <CallEndIcon style={{ color: '#f6fcf8' }} />
                                        </Button>
                                    </div>
                                    <div className='btn-accep-call-bao'>
                                        <Button
                                            className="btn-accep-call"
                                            onClick={handleAnswer}
                                            style={{ backgroundColor: '#179c4c' }}>
                                            <CallIcon style={{ color: '#f6fcf8' }} />
                                        </Button>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </Fade>
                </Modal>

            </div>
        </div>
    );
};

export default Home;
