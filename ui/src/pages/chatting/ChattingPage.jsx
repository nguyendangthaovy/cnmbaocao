import './chatting.css';

import {
    Avatar,
    AvatarGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    addManager,
    currentAConverSelector,
    currentConversationSelector,
    deleteConversationAsync,
    getLastViewOfMembers,
    getListMembers,
    leaveGroup,
    listMemberSelector,
    removeManager,
    removeMember,
    updateAvatarWhenUpdateMember,
    updateMemberInconver,
    // updateLastViewOfMembers,
} from '../../store/reducers/conversationReducer/conversationSlice';
import {
    getMessagesByPage,
    handleRenameGroup,
    messagesSelector,
    sendImage,
    sendImages,
} from '../../store/reducers/messageReducer/messageSlice';
import dateUtils from '../../utils/dateUtils';
import CustomizedInputBase from '../../components/CustomizedInputBase/CustomizedInputBase';
import jwt from '../../utils/jwt';
import { useEffect, useRef, useState } from 'react';
import HeaderUser from '../../components/ChatHeaderUser/HeaderUser';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { Button } from '@material-ui/core';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { apiMessage } from '../../api/apiMessage';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { friendSelector } from '../../store/reducers/friendReducer/friendReducer';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { meSelector } from '../../store/reducers/userReducer/meReducer';
import { apiConversations } from '../../api/apiConversation';
import { useCallback } from 'react';
import ModalProfileFriend from '../../components/MyChat/ListFriend/ModalProfileFriend';
import ModalProfile from '../../components/SideNavbar/ModalProfile/ModalProfile';
import { apiUser } from '../../api/apiUser';
import { apiFriend } from '../../api/apiFriend';
import ModalRename from './ModalRename/ModalRename';

const TYPE_MATCH_MEDIA = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'];

const TYPE_MATCH = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'video/mp3',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/zip',
];

let currentId = "";
let oldSize = 0;
const ChattingPage = ({ socket }) => {
    const dispatch = useDispatch();
    const me = useSelector(meSelector);
    const listMember = useSelector(listMemberSelector);
    const [members, setMembers] = useState([]);
    const tabInfoRef = useRef();
    const currentConversation = useSelector(currentConversationSelector);
    const conversation = useSelector(currentAConverSelector);
    const messages = useSelector(messagesSelector);
    const user = { _id: jwt.getUserId() };
    const friendProfile = useSelector(friendSelector);
    const [frProfile, setFrProfile] = useState('');
    const scroll = useRef();
    const dispath = useDispatch();
    const [usersTyping, setUsersTyping] = useState([]);
    const [isType, setType] = useState(false);
    const [option, setOption] = useState({
        option: 0,
        id: '',
    });
    const [openProfile, setOpenProfile] = useState(false);
    const [friendProfilee, setFriendProfilee] = useState();
    const [openMyProfile, setOpenMyProfile] = useState(false);
    const [openModalRename, setOpenModalRename] = useState(false);
    const [infoRoom, setInfoRoom] = useState();
    const handleOpenModalRename = () => {
        setOpenModalRename(true);
    };
    const handleCloseModalRename = () => {
        setOpenModalRename(false);
    }
    const handleCloseProfile = () => {
        setOpenProfile(false);
        setOpenMyProfile(false);
    };
    const getFriendIdOption = async (optionId) => {
        const temp = optionId
        console.log("idoption", temp)
        if (temp && temp !== user._id) {
            const fen = await apiFriend.findFriendById(temp)
            setFriendProfilee(fen.data);
            setOpenProfile(true);
        } else if (temp && temp === user._id)
            setOpenMyProfile(true)
    }
    // useEffect(()=> {
    //     scroll.current.addEventListener("scroll", (event)=>{
    //         const scrollTop = event.target.scrollTop;
    //     let page = messages.page;
    //     const totalPages = messages.totalPages;

    //     if (scrollTop === 0 && page < totalPages) {
    //         page += 1;

    //         dispatch(getMessagesByPage({ id: currentConversation, page }));
    //     }
    //     })
    // }, [currentConversation])
    const handleScroll = (event) => {

        const scrollTop = event.target.scrollTop;
        let page = messages.page;
        const totalPages = messages.totalPages;

        if (scrollTop === 0) {

            if (page <= totalPages) {

                page += 1;

                dispatch(getMessagesByPage({ id: currentConversation, page }));
            }
        }
        // console.log('scrollTop: ', event.currentTarget.scrollTop, scrollTop === 0);
        // console.log('offsetHeight: ', event.currentTarget.offsetHeight);
    };

    useEffect(() => {
        setFrProfile(friendProfile);
    }, [friendProfile]);
    // cập nhật trang tháng của các component
    const membersRef = useRef();
    const fileRef = useRef();
    const handleShowMember = () => {
        membersRef.current.classList.toggle('showMembers');
    };
    const handleShowPic = () => {
        fileRef.current.classList.toggle('showPics');

    };
    useEffect(() => {
        setMembers(listMember);
    }, [listMember]);
    // cập nhật member, list menber

    useEffect(() => {
        if (messages.data)
            oldSize = messages.data.length;
        socket.on('typing', (conversationId, user) => {
            console.log('typing....', currentId);
            currentId = conversationId;

            const index = usersTyping.findIndex((ele) => ele._id === user._id);
            if (usersTyping.length === 0 || index < 0) {
                setUsersTyping([...usersTyping, user]);
            }
            // được thực thi mỗi khi tn thay đổi và lưu utyping

        });

        socket.on('not-typing', (conversationId, user) => {
            currentId = conversationId;
            console.log('not-typing....');

            const index = usersTyping.findIndex((ele) => ele._id === user._id);
            const newUserTyping = usersTyping.filter((ele) => ele._id !== user._id);

            setUsersTyping(newUserTyping);
            // typing chứa ng dùng đang gõ tin nhắn



        });
        socket.on('update-member', async (conversationId) => {
            if (conversationId === conversation._id) {
                await dispatch(getLastViewOfMembers({ conversationId }));
                const { data } = await apiConversations.getListMember(conversation._id);
                console.log("LIST MEMB", data);
                dispatch(updateMemberInconver({ conversationId, newMember: data }));
            }
        });//kitra máy chủ có trúng khớp vs id của cuộc trò chuyện

    }, [currentConversation]);

    // chọn tệp đính kèm
    const inputRef = useRef(null);
    const handleClickChooseFile = () => {
        // khi người dùng click vào phần tử khác, sẽ đc gọi để mở tệp
        inputRef.current.click();
    };
    const handleFileChange = async (event) => {
        const files = event.target.files;
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        } // chọn 1 hoặc nhiều tếp và gửi lên máy chủ
        const formData = new FormData();
        const callback = (percentCompleted) => {
            console.log(percentCompleted);
        };

        if (files.length > 1) {
            for (let file of files) {
                for (let type of TYPE_MATCH_MEDIA) {
                    if (file.type === type) {
                        formData.append('files', file);
                    }//ktra tệp có phải là tệp đa phương tiện 
                }
            }
            const attachInfo = {
                type: 'GROUP_IMAGE',
                conversationId: currentConversation,
            };// tạo 1 đối tượng, cung cấp thông tin về tệp và id của cuộc trò chuyện

            try {
                if (formData.has('files')) dispath(sendImages({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }//gọi hàm để gửi các tệp lên máy chủ
        } else {
            let mineType = 'IMAGE';

            if (!checkFileMedia(fileObj)) return;
            if (fileObj.type === TYPE_MATCH_MEDIA[3]) mineType = 'VIDEO';
            formData.append('file', fileObj);
            const attachInfo = {
                type: mineType,
                conversationId: currentConversation,
            };//chọn 1 tệp, hàm ktra video, hình có hợp lệ

            try {
                if (formData.has('file')) dispath(sendImage({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }
        }// gửi tệp đính kèm lên máy chủ

        event.target.value = null;
    };
    function checkFileMedia(file) {
        for (let type of TYPE_MATCH_MEDIA) {
            if (file.type === type) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        if (messages.data) {
            if (messages.data.length - oldSize <= 1) {
                const scrollToBottom = (node) => {
                    node.scrollTop = node.scrollHeight;
                };
                scrollToBottom(scroll.current);

                setTimeout(() => {
                    scrollToBottom(scroll.current);
                }, 1000);
                scroll.current.scrollIntoView({ behavior: 'smooth' });
            }
            oldSize = messages.data.length;
        }
    }, [messages])
    useEffect(() => {

        const scrollToBottom = (node) => {
            node.scrollTop = node.scrollHeight;
        };
        scrollToBottom(scroll.current);

        setTimeout(() => {
            scrollToBottom(scroll.current);
        }, 1000);
        scroll.current.scrollIntoView({ behavior: 'smooth' });


    }, [currentConversation]);
    // nội dung cuộc cuộc trò chuyện xuống cuối


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        if (id === user._id) {
            setOption({
                option: 1,
                id,
            });
        }
        else if (id !== user._id && conversation.leaderId === user._id) {
            setOption({
                option: 2,
                id,
            });
        } else if (id !== user._id && conversation.managerIds.includes(user._id)) {
            setOption({
                option: 3,
                id,
            });
        } else if ((id !== user._id && conversation.leaderId !== user._id) && !conversation.managerIds.includes(user._id)) {
            setOption({
                option: 4,
                id,
            })
        } else {
            setOption({
                option: 0,
                id: '',
            });
        }
    };//hiển thị menu context tương ưng khi người dùng click vào 1 tn hoặc cuộc trò chuyện
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLeaveGroup = () => {
        dispatch(leaveGroup({ conversationId: conversation._id }));
        setAnchorEl(null);
    };// Người dùng rời khỏi nhóm
    const handleDeleteGroup = async () => {
        await apiConversations.deleteAllChatInConversation({ conversationId: conversation._id })
        dispatch(deleteConversationAsync({ conversationId: conversation._id }));
        setAnchorEl(null);
    };//hàm xóa nhóm

    const handleRemoveMember = async () => {
        dispatch(removeMember({ conversationId: conversation._id, userId: option.id }));


        setAnchorEl(null);
    };//hàm loại bỏ 1 tv khỏi nhóm

    const handleAddManager = () => {
        dispatch(addManager({ conversationId: conversation._id, managerIds: [option.id] }));
        dispatch(handleRenameGroup())
        setAnchorEl(null);
    };// hàm thêm thành viên

    const handleRemoveManager = () => {
        console.log('Removing ', [option.id]);
        dispatch(handleRenameGroup())
        dispatch(removeManager({ conversationId: conversation._id, managerIds: [option.id] }));
        setAnchorEl(null);
    };//loại bỏ tv khỏi danh dách ql nhóm nói chuyện
    


    const MemberSelect = (option) => {

        return (
            <div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}

                >
                    <MenuItem
                        style={{ padding: '5px 5px' }}
                        onClick={getFriendIdOption.bind(this, option.id)}
                    >
                        Xem thông tin
                    </MenuItem>

                    {(option.id === user._id && option.id !== conversation.leaderId) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleLeaveGroup}>
                            Rời khỏi nhóm
                        </MenuItem>
                    }
                    {(option.id === user._id && option.id === conversation.leaderId) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleDeleteGroup} >
                            Xóa cuộc trò chuyện
                        </MenuItem>
                    }
                    {(option.option === 2 && conversation.managerIds.includes(option.id)) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveManager}>
                            Xóa phó nhóm
                        </MenuItem>
                    }
                    {(option.option === 2 && !conversation.managerIds.includes(option.id)) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleAddManager}>
                            Thêm phó nhóm
                        </MenuItem>
                    }
                    {
                        option.option === 2 &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    }
                    {
                        (option.option === 3 && (option.id !== conversation.leaderId || conversation.managerIds.includes(option.id)))
                        &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    }
                    <ModalProfile openProfilee={openMyProfile} closeProfile={handleCloseProfile} />
                    <ModalProfileFriend friend={friendProfilee} openProfilee={openProfile} closeProfile={handleCloseProfile} />
                </Menu>
            </div>
        );
    };
    //menu người dùng
    return (
        <div className="wrapChatting">
            <div className="chatting">
                <div className="headerUser">
                    {messages.data && (
                        <HeaderUser tabInfoRef={tabInfoRef} socket={socket} conversation={conversation} />
                    )}
                </div>
                {/* message */}
                <div onScroll={handleScroll} ref={scroll} className="roomChat scrollbar" id="style-scroll">
                    {messages.data &&
                        messages.data.map((msg) => {
                            if (msg.type === 'TEXT') return Chatlogic.messageText(msg, user);
                            else if (msg.type === 'IMAGE') return Chatlogic.messageImage(msg, user);
                            else if (msg.type === 'VIDEO') return Chatlogic.messageImage(msg, user);
                            else if (msg.type === 'GROUP_IMAGE') return Chatlogic.messageGroupImage(msg, user);
                            else if (msg.type === 'NOTIFY') return Chatlogic.messageNotify(msg);
                        })}
                </div>

                <div>
                    {(usersTyping.length > 0 && currentId === currentConversation) && (
                        <div key={currentConversation} className="typing-message ">
                            {usersTyping.map((ele, index) => (
                                <span key={ele._id}>
                                    {index < 3 && (
                                        <>{index === usersTyping.length - 1 ? `${ele.name} ` : `${ele.name}, `}</>
                                    )}
                                </span>
                            ))}
                            {usersTyping.length > 3 ? `và ${usersTyping.length - 3} người khác` : ''}
                            <span>&nbsp;đang nhập</span>
                            <div className="snippet" data-title=".dot-flashing">
                                <div className="stage">
                                    <div className="dot-flashing"></div>
                                </div>
                            </div>
                        </div>
                    )} //hiện thị danh sách người đang nhập vào cuôc trò chuyện
                </div>
                {/* Giao diện gửi tin nhắn */}
                {currentConversation ? (
                    <div className="chatAction">

                        <div className="sendOption">
                            <input
                                accept="image/*,video/mp4,video/x-m4v,video/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                            />
                            <Button onClick={handleClickChooseFile} className="btnOption">
                                <InsertPhotoOutlinedIcon />
                            </Button>
                            <Button className="btnOption">
                                <AttachFileOutlinedIcon />
                            </Button>
                        </div>
                        <div className="sendMessage">
                            <CustomizedInputBase me={me} socket={socket} conversationId={currentConversation} />
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
            {/* hiển thị thông tin cuộc trò chuyện, ảnh đại diện, tên gr, số lượng tv */}
            <div className="infoConversation">
                <div ref={tabInfoRef} className="infoContainer hide scrollbar" id="style-scroll">
                    <h5 className="titleInfo">Thông tin {conversation.type ? 'nhóm' : 'hội thoại'}</h5>

                    <div >
                        <div className="wrapInfoAvatar">
                            {conversation.type ? (
                                <AvatarGroup className="group" total={members.length > -1 ? members.length : conversation.totalMembers}>

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
                                </AvatarGroup>
                            ) : (
                                //ảnh đại diện 
                                <Avatar
                                    sx={{ width: 56, height: 56 }}
                                    className="conversationAvatar"
                                    src={conversation.avatar ? conversation.avatar : ''}
                                />
                            )}
                        </div>
                        <h5> //tên cuộc trò chuyện
                            {conversation.name ? conversation.name : 'name'}
                            <span className="btnEditName">
                                <BorderColorOutlinedIcon
                                    onClick={() => {
                                        setOpenModalRename(true);
                                        setInfoRoom(conversation)
                                    }
                                    } />{' '}
                            </span>
                            <ModalRename conversation={conversation} infoRoom={infoRoom} openModalRename={openModalRename} closeModalRename={handleCloseModalRename} />
                        </h5>
                    </div>
                    <div className="infoGroupCommon">
                        {conversation.type === false ? (
                            <p style={{ paddingTop: '12px' }}>
                                <GroupsOutlinedIcon style={{ margin: '0 5px' }} />{' '}
                                {frProfile ? frProfile.numberCommonGroup : 0}nhóm chung
                            </p>
                        ) : (
                            <p style={{ paddingTop: '12px' }} onClick={handleShowMember}>
                                <PeopleOutlinedIcon style={{ margin: '0 5px' }} />
                                {members.length > -1 ? members.length : 0} thành viên
                            </p>
                        )}
                        <div ref={membersRef} className="containerMembers">
                            <List className="listMember scrollbar" id="style-scroll">
                                {members.map((member) => (
                                    <ListItem key={member._id}>
                                        <ListItemAvatar>
                                            <Avatar src={member.avatar && member.avatar} alt={member.name}></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={member.name} />

                                        <ListItemIcon>
                                            <MoreVertIcon
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={(e) => handleClick(e, member._id)}
                                            />
                                        </ListItemIcon>
                                    </ListItem>
                                ))}
                                {MemberSelect(option)}
                            </List>
                        </div>
                    </div>
                    <div className="infoMedia" >
                        <h5 onClick={handleShowPic}>Ảnh/Video</h5>
                        <div ref={fileRef} className='bao-info-pic scrollbar' id="style-scroll">

                            {messages.data &&
                                messages.data.map((msg) => {
                                    if (msg.type === 'IMAGE')
                                        return <div

                                            key={msg.content}
                                            style={{ width: '82px', height: '82px', padding: '10px' }}
                                        >
                                            <img
                                                style={{ width: '100%', height: '100%' }}
                                                src={msg.content} alt=""
                                            />
                                        </div>
                                    else if (msg.type === 'VIDEO')
                                        return (<div
                                            key={msg.content}
                                            style={{ width: '82px', height: '82px', padding: '10px' }}
                                        >
                                            <video
                                                style={{ width: '100%', height: '100%' }}
                                                src={msg.content}>
                                            </video>
                                        </div>)
                                    else if (msg.type === 'GROUP_IMAGE') {
                                        const listImage = msg.content.split(';');
                                        listImage.splice(listImage.length - 1, 1);


                                        return listImage.map((file) => {
                                            if (checkType(file) === 'VIDEO')
                                                return (
                                                    <div
                                                        key={file}
                                                        style={{ width: '82px', height: '82px', padding: '10px' }}
                                                    >
                                                        <video
                                                            style={{ width: '100%', height: '100%' }}
                                                            controls
                                                            key={file}
                                                            src={file}
                                                            alt={file}
                                                            className="imageMessage"
                                                        />
                                                    </div>
                                                );
                                            else
                                                return (
                                                    <div
                                                        key={file}
                                                        style={{ width: '82px', height: '82px', padding: '10px' }}
                                                    >
                                                        <img
                                                            style={{ width: '100%', height: '100%' }}
                                                            key={file} src={file} alt={file} className="imageMessage" />
                                                    </div>
                                                );


                                        })

                                    }
                                })}
                        </div>
                    </div>
                    <div className="infoFile">
                        <h5>File</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Chatlogic = {
    messageText: (msg, user) => (
        <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
            <div className="wrapperMessage">
                <div className="messageUser">
                    <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                </div>
                <div className="content">
                    <div className={`messageName`} style={{ fontSize: '13px', textIndent: '2px' }}>
                        {msg.user.name}
                    </div>
                    <div
                        style={{
                            padding: '5px 0',
                            wordWrap: 'break-word',
                            contain: 'style',
                            wordBreak: 'break-word',
                        }}
                    >
                        {msg.content}
                    </div>
                    <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                </div>
            </div>
        </div>
    ),

    messageImage: (msg, user) => (
        <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
            <div className="wrapperMessage">
                <div className="messageUser">
                    <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                </div>
                <div className="content">
                    <div className="isMessageGroup messageName" style={{ fontSize: '13px', textIndent: '2px' }}>
                        {msg.name}
                    </div>
                    <div style={{ padding: '5px 0' }}>
                        {checkType(msg.content) === 'VIDEO' ? (
                            <video controls src={msg.content} alt="không tải được video" className="imageMessage" />
                        ) : (
                            <img src={msg.content} alt="không tải được ảnh" className="imageMessage" />
                        )}
                    </div>
                    <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                </div>
            </div>
        </div>
    ),
    messageGroupImage: (msg, user) => {
        const listImage = msg.content.split(';');
        listImage.splice(listImage.length - 1, 1);

        return (
            <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
                <div className="wrapperMessage">
                    <div className="messageUser">
                        <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                    </div>
                    <div className="content">
                        <div className="isMessageGroup messageName" style={{ fontSize: '13px', textIndent: '2px' }}>
                            {msg.name}
                        </div>
                        <div style={{ padding: '5px 0' }}>
                            <div className="groupImage">
                                {listImage &&
                                    listImage.map((file) => {
                                        if (checkType(file) === 'VIDEO')
                                            return (
                                                <video
                                                    controls
                                                    key={file}
                                                    src={file}
                                                    alt={file}
                                                    className="imageMessage"
                                                />
                                            );
                                        else return <img key={file} src={file} alt={file} className="imageMessage" />;
                                    })}
                            </div>
                        </div>
                        <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                    </div>
                </div>
            </div>
        );
    },
    messageNotify: (msg) => (
        <div key={msg._id} style={{ position: 'relative' }}>
            <hr />
            <span
                style={{
                    position: 'absolute',
                    margin: 0,
                    top: '50%',
                    left: '50%',
                    msTransform: 'translate(-50%, -50%)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 999,
                    backgroundColor: '#f7f7f7',
                    borderRadius: '10px',
                    color: '#000',
                    padding: '0 10px',

                    alignItems: 'center',
                }}
            >
                {msg.content}
            </span>
        </div>
    ),
};

const checkType = (content) => {
    const splitTempt = content.split('.');
    const fileExtension = splitTempt[splitTempt.length - 1];
    if (fileExtension === 'mp4') return 'VIDEO';
    return 'IMAGE';
};

export default ChattingPage;
