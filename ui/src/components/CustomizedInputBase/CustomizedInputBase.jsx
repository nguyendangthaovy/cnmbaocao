import React, { useEffect, useState } from 'react';
import './customInput.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import { useDispatch } from 'react-redux';
import { sendMessage } from '../../store/reducers/messageReducer/messageSlice';
import EmojiPicker from 'emoji-picker-react';
import InputEmoji from 'react-input-emoji';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'unset',
        flex: 1,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: '15px',
    },
    iconButton: {
        padding: 10,
        fontSize: 17,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

let typing = false;
let timeout = undefined;

export default function CustomizedInputBase({ conversationId, socket, me }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    useEffect(() => {
        setText('');
    }, [conversationId]);
    const onEmojiClick = (emojiObj) => {
        setText((prv) => prv + emojiObj.emoji);
    };
    function timeoutFunction() {
        typing = false;
        socket.emit('not-typing', conversationId, me);
    }
    function onKeyDownNotEnter() {
        if (typing === false) {
            typing = true;
            socket.emit('typing', conversationId, me);
            timeout = setTimeout(timeoutFunction, 1000);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 1000);
        }
    }

    const onClickToSend = (e) => {
        try {
            e.preventDefault();
        } catch (error) {}
        dispatch(
            sendMessage({
                content: text,
                conversationId,
                type: 'TEXT',
            }),
        );
        setText('');
    };

    return (
        <Paper onSubmit={onClickToSend} component="form" className={`${classes.root} wrapInput`}>
            <InputEmoji
                value={text}
                onChange={setText}
                cleanOnEnter
                onKeyDown={onKeyDownNotEnter}
                onEnter={(e) => onClickToSend(e)}
                placeholder="Nhập tin nhắn"
            />

            <Divider className={classes.divider} orientation="vertical" />
            <IconButton type="submit" color="primary" className={classes.iconButton} aria-label="send">
                Gửi
            </IconButton>
        </Paper>
    );
}
