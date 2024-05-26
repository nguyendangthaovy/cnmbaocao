import './listConversation.css';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { AvatarGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {
    conversationSelector,
    currentConversationSelector,
    getList,
    getListMembers,
    numberUnreadSelector,
    setCurrentConversation,
    updateTimeForConver,
} from '../../../store/reducers/conversationReducer/conversationSlice';
import { loginSelector } from '../../../store/reducers/loginReducer/loginSlice';
import { getMessages } from '../../../store/reducers/messageReducer/messageSlice';
import { findFriendById } from '../../../store/reducers/friendReducer/friendReducer';
import { useRef } from 'react';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eee;',
        },
    },
}));
const ListConversation = ({ socket }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const conversations = useSelector(conversationSelector);
    const user = useSelector(loginSelector);
    const currentConversation = useSelector(currentConversationSelector);
    const chooseRoom = useRef();
    const [roomSelect, setRoomSelect] = useState();
    const onSelectConversation = (conversation) => {
        setRoomSelect(conversation._id)
        dispatch(setCurrentConversation(conversation));
        dispatch(getMessages({ id: conversation._id }));
        dispatch(getListMembers({ conversationId: conversation._id }));
        // if (!conversations.type) dispatch(findFriendById(conversation.userId));

    };
    
    return (
        <List className={classes.root}>
            
            {conversations &&
                conversations.map((conversation) =>
                    conversation.type ? (
                        <ListItem 
                            selected={roomSelect === conversation._id ? true : false}
                            onClick={onSelectConversation.bind(this, conversation)}
                            key={conversation._id}
                            className={classes.listItem}
                            alignItems="flex-start"
                        >
                            <ListItemAvatar className="listAvatar">
                                <AvatarGroup className="group" total={conversation.totalMembers}>
                                    
                                    <Avatar
                                        className="iconAvatar"
                                        alt="A"
                                        src={`${conversation.avatar ? conversation.avatar[0].avatar : ''}`}
                                    />
                                    {conversation.avatar.length > 1 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="B"
                                            src={`${
                                                conversation.avatar ? conversation.avatar[1].avatar : ''
                                            }`}
                                        />
                                    )}

                                    {conversation.avatar.length > 2 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="C"
                                            src={`${
                                                conversation.avatar ? conversation.avatar[2].avatar : ''
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
                            </ListItemAvatar>
                            <ListItemText
                                primary={conversation.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {conversation.lastMessage ? conversation.lastMessage.user.name : ''}
                                        </Typography>
                                        {': '}
                                        {conversation.lastMessage.type === 'TEXT' && conversation.lastMessage.content}
                                        {/* {': ' + (conversation.lastMessage ? conversation.lastMessage.content : '')} */}
                                        {conversation.lastMessage.type === 'IMAGE' && 'đã gửi hình ảnh'}
                                        {conversation.lastMessage.type === 'GROUP_IMAGE' && 'đã gửi các hình ảnh'}
                                    </React.Fragment>
                                }
                            />
                            <MoreHorizIcon className="moreIcon" />
                            <div style={{ alignSelf: 'center' }}>
                                {conversation.numberUnread > 0 && (
                                    <Avatar
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '14px',
                                            backgroundColor: 'white',
                                            color: 'red',
                                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                        }}
                                        className="numberUnread"
                                    >
                                        {conversation.numberUnread}
                                    </Avatar>
                                )}
                            </div>
                        </ListItem>
                    ) : (
                        <ListItem
                            selected={roomSelect === conversation._id ? true : false}
                            onClick={onSelectConversation.bind(this, conversation)}
                            key={conversation._id}
                            className={`${classes.listItem} listItem`}
                            alignItems="flex-start"
                        >
                            <ListItemAvatar>
                                <Avatar alt="Cindy Baker" src={conversation.avatar ? conversation.avatar : ''} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={conversation.name}
                                className="textContent"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {conversation.lastMessage.user.name}
                                        </Typography>
                                        {': '}
                                        {conversation.lastMessage.type === 'TEXT' && conversation.lastMessage.content}
                                        {/* {': ' + (conversation.lastMessage ? conversation.lastMessage.content : '')} */}
                                        {conversation.lastMessage.type === 'IMAGE' && 'đã gửi hình ảnh'}
                                    </React.Fragment>
                                }
                            />
                            <MoreHorizIcon className="moreIcon" />
                            <div style={{ alignSelf: 'center' }}>
                                {conversation.numberUnread > 0 && (
                                    <Avatar
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '14px',
                                            backgroundColor: 'white',
                                            color: 'red',
                                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                        }}
                                        className="numberUnread"
                                    >
                                        {conversation.numberUnread}
                                    </Avatar>
                                )}
                            </div>
                        </ListItem>
                    ),
                )}
        </List>
    );
};

export default ListConversation;
