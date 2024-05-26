import { Avatar, Button } from '@material-ui/core';
import { AvatarGroup } from '@mui/material';
import './headerUser.css';
import PhoneIcon from '@material-ui/icons/Phone';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getListMembers, listMemberSelector } from '../../store/reducers/conversationReducer/conversationSlice';
import jwt from '../../utils/jwt';
import { useEffect } from 'react';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { useState } from 'react';
import { Preview } from '@mui/icons-material';
import SearchAddMember from '../SearchAddMember/SearchAddMember';
import { listFriendSelector } from '../../store/reducers/friendReducer/friendReducer';

const HeaderUser = ({ conversation, tabInfoRef, socket }) => {
   const dispatch = useDispatch();
    const members = useSelector(listMemberSelector);
    // const [members,setMember] = useState([]);
    const listFriend = useSelector(listFriendSelector);
    const myId = jwt.getUserId();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleShowTabInfo = () => {
        // tabInfoRef.current.classList.add('')
        const hasClass = tabInfoRef.current.classList.contains('hide');
        if (hasClass) tabInfoRef.current.classList.remove('hide');
        else tabInfoRef.current.classList.add('hide');
    };
    // useEffect(() => {
    //     if(membersSlec)
    //         setMember(membersSlec);
    // }, [members]);
    const handleCall = () => {
        if (members.length === 2) {
            const { _id: userId } = members.find((member) => member._id !== myId);
            console.log(userId);
            socket.emit('has-call', userId, myId);
        }
    };
    const handleAdd = () => {
        setOpen((prv) => !prv);
    };
    useEffect(() => {
        if (members.length === 2) {
            const { _id: userId } = members.find((member) => member._id !== myId);
            socket.on('accept-call', (idCall) => {
                window.open(`/call/${userId}`, '_blank');
            });
        }
    }, []);
    const removeDuplicateMembers = () => {
        const list = [...listFriend];
        if (members.length > 0 && listFriend.length > 0)
            for (let i = 0; i < members.length; ++i) {
                for (let j = 0; j < listFriend.length; ++j) {
                    if (members[i]._id === listFriend[j]._id) {
                        list.splice(j, 1);
                    }
                }
            }
        return list;
    };
    removeDuplicateMembers();
    return (
        <div className="conversation">
            <div>
                <SearchAddMember
                    conversation={conversation}
                    isOpen={open}
                    setIsOpen={setOpen}
                    listMem={removeDuplicateMembers()}
                />
            </div>
            <div className="conversationInfor">
                {conversation.type ? (
                    <AvatarGroup className="group" total={members.length>-1? members.length : 0}>
                                   
                    <Avatar
                        className="iconAvatar"
                        alt="A"
                        src={`${members[0] ? members[0].avatar : ''}`}
                    />
                    {members.length > 1 && (
                        <Avatar
                            className="iconAvatar"
                            alt="B"
                            src={`${members[1] ? members[1].avatar : ''
                                }`}
                        />
                    )}

                    {members.length > 2 && (
                        <Avatar
                            className="iconAvatar"
                            alt="C"
                            src={`${members[2] ? members[2].avatar : ''
                                }`}
                        />
                    )}

                    {/* {conversation.avatar.length > 3 && (
                        <Avatar
                            className="iconAvatar"
                            alt="D"
                            src={`${
                                conversation.avatar[3].avatar ? conversation.avatar[3].avatar : '3'
                            }`}
                        />
                    )} */}
                </AvatarGroup>
                ) : (
                    <Avatar className="conversationAvatar" src={conversation.avatar ? conversation.avatar : ''} />
                )}

                <div className="conversationName">
                    <h5 className="name">{conversation.name ? conversation.name : 'name'}</h5>
                    <p className="isOnline">1 phút trước</p>
                </div>
            </div>
            <div style={{ flex: '1' }}></div>

            <div>
                <div className="conversationOption">
                    {!conversation.type && (
                        <Button onClick={handleCall}>
                            <PhoneIcon />
                        </Button>
                    )}
                    {(conversation.type && (myId === conversation.leaderId || conversation.managerIds.includes(myId))) &&(
                        <Button onClick={handleAdd}>
                            <PersonAddOutlinedIcon fontSize="small" />
                        </Button>
                    )}

                    {/* <Button>
                        <VideoCallIcon />
                    </Button> */}
                    <Button onClick={handleShowTabInfo}>
                        <VerticalSplitIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeaderUser;
