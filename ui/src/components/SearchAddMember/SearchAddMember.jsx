import './searchAddMember.css';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Input } from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import { addMember, updateAvatarWhenUpdateMember } from '../../store/reducers/conversationReducer/conversationSlice';
import { useDispatch } from 'react-redux';
import { apiConversations } from '../../api/apiConversation';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        maxHeight: 500,
        height: 500,
        backgroundColor: theme.palette.background.paper,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    wrapBtnAdd: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

export default function SearchAddMember({ conversation, listMem, isOpen, setIsOpen }) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [searchText, setSearchText] = useState('');
    const [members, setMembers] = useState([]);
    const membersRef = useRef();
    useEffect(() => {
        membersRef.current = listMem;
        setMembers(membersRef.current);
        setOpen(isOpen);
    }, [isOpen, listMem]);
    // handle modal
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };
    // end modal

    // handle list
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // end list
    // handle search
    const handleSearch = (value) => {
        setSearchText(value);
        if (value === '') setMembers(membersRef.current);
        else {
            const newList = membersRef.current.filter((member) => member.name.includes(value));
            setMembers(newList);
        }
    };
    // end search
    // handl add mem
    const handleAddMember = async() => {
        console.log("LIST ADD", checked);
        if (checked.length > 0) {
            dispatch(addMember({ conversationId: conversation._id, userIds: checked }))
            // const data = await apiConversations.getConversationById(conversation._id);
            // const converById = data.data
            // const avatar = converById.avatar;
            // const totalMembers = converById.totalMembers;
            // // const { avatar, totalMembers } = data.data;
            // console.log("AVATAR", avatar);
            // dispatch(
            //     updateAvatarWhenUpdateMember({
            //         conversationId: conversation._id,
            //         avatar:avatar,
            //         totalMembers:totalMembers,
            //     }),
            // );
        };
        handleClose();
    };
    // end
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Thêm thành viên</h2>
                        <div>
                            <div>
                                <Input
                                    value={searchText}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Nhập tên để tìm kiếm"
                                    inputProps={{ 'aria-label': 'description' }}
                                />
                            </div>
                            <List dense className={`${classes.root} scrollbar`} id="style-scroll">
                                {members.map((member) => {
                                    const labelId = `checkbox-list-secondary-label-${member._id}`;
                                    return (
                                        <ListItem key={member._id} button className="list">
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={`Avatar n°${member.name}`}
                                                    src={member.avatar ? member.avatar : ''}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={member.name} />

                                            <ListItemSecondaryAction>
                                                <Checkbox
                                                    edge="end"
                                                    onChange={handleToggle(member._id)}
                                                    checked={checked.indexOf(member._id) !== -1}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                        <div className={classes.wrapBtnAdd}>
                            <Button onClick={handleAddMember} variant="contained" color="secondary">
                                Thêm
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
