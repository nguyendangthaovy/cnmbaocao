import React, { useEffect, useRef } from 'react';
import './searchInput.css';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { Avatar, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    findFriend,
    friendSelector,
    inviteFriend,
    listFriendSelector,
    setEmptyFriend,
} from '../../store/reducers/friendReducer/friendReducer';
import jwt from '../../utils/jwt';

import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import Radio from '@material-ui/core/Radio';
import TransferList from './TransferList/TransferList';
import { createGroupConversation } from '../../store/reducers/conversationReducer/conversationSlice';
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'unset',
        flex: 1,
    },

    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: 'white',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function SearchInput() {
    // transfer
    const buttonRef = useRef();
    const friendToCreateGroup = useRef();
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const lsFr = useSelector(listFriendSelector);
    const listTempt = lsFr;
    const listIndex = useRef(Array.from({ length: lsFr.length }, (_, i) => i));
    //
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [openGroup, setOpenGroup] = React.useState(false);
    const friend = useSelector(friendSelector);
    const [phone, setPhone] = React.useState('');
    const [nameGroup, setNameGroup] = React.useState('');
    const [searchInput, setSearchInput] = React.useState('');
    const [result, setResult] = React.useState(null);

    const [selectedValue, setSelectedValue] = React.useState('a');
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    React.useEffect(()=> {
        listIndex.current = Array.from({ length: lsFr.length }, (_, i) => i);
    }, [lsFr])
    React.useEffect(() => {
        setLeft(listIndex.current);
    }, [listIndex.current]);
    useEffect(() => {
        if (searchInput.length === 0 || searchInput === null) {
            setLeft(listIndex.current);
        } else {
            let search = searchInput;
            search = search.trim();
            let lsTempt = [];
            let regex = new RegExp('.*' + search + '.*', 'i');

            for (let i of listIndex.current) {
                if (regex.test(listTempt[i].name)) {
                    lsTempt.push(i);
                }
            }
            setLeft(lsTempt);
        }
    }, [searchInput]);
    const handleCreateGroup = () => {
        if (friendToCreateGroup.current.length >= 2 && nameGroup.trim().length > 2) {
            console.log('đủ điều kiện', friendToCreateGroup.current);
            const name = nameGroup.trim();
            const userIds = friendToCreateGroup.current;
            dispatch(createGroupConversation({ name, userIds }));
        }
        handleCloseModalGroup();
    };

    const handleOpen = () => {
        setOpen(true);
        setResult(null);
        setPhone('');
    };
    const handleOpenModalGroup = () => {
        setNameGroup('');
        setRight([]);
        friendToCreateGroup.current = [];
        setOpenGroup(true);
        setResult(null);
        setPhone('');
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseModalGroup = () => {
        setOpenGroup(false);
    };
    useEffect(() => {
        if (friend) {
            setResult(friend._id !== jwt.getUserId() ? friend : null);
            console.log(friend);
        }
    }, [friend]);

    const onClickToSearch = () => {
        setResult(null);
        if (!phone.length > 0 || !/[0-9]{10}/.test(phone)) return;
        dispatch(findFriend(phone));
    };
    const onClickInvite = (result) => {
        dispatch(inviteFriend(result));
        setResult(null);
        dispatch(setEmptyFriend());
    };
    return (
        <>
            <Paper className={classes.root}>
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon fontSize="small" />
                </IconButton>
                <InputBase className={classes.input} placeholder="Tìm kiếm" inputProps={{ 'aria-label': 'search' }} />

                <IconButton type="submit" className={classes.iconButton} onClick={handleOpen} aria-label="add-one">
                    <PersonAddOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                    type="submit"
                    className={classes.iconButton}
                    onClick={handleOpenModalGroup}
                    aria-label="add-group"
                >
                    <GroupAddOutlinedIcon fontSize="small" />
                </IconButton>
            </Paper>
            {/* thêm bạn */}
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
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
                    <div className={`${classes.paper} modalAddFriend`}>
                        <div className="modalAddFriendHeader">
                            <p>Thêm bạn</p>
                            <button onClick={handleClose}>&#10005;</button>
                        </div>
                        <div className="modalAddFriendBody">
                            <div className="modalAddFriendInput">
                                <span> +84</span>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Số điện thoại"
                                />
                            </div>
                            <div className="modalAddFriendResult scrollbar" id="style-scroll">
                                <div>
                                    {result && result._id !== jwt.getUserId() && (
                                        <div className="friendItemInvite">
                                            <Avatar style={{ marginLeft: '10px' }} src={result ? result.avatar : ''} />
                                            <div style={{ flex: 1 }}>
                                                <p className="friendItemInfo">{result ? result.username : ''}</p>
                                                <p className="friendItemInfo">{result ? result.name : ''}</p>
                                            </div>
                                            <div>
                                                {}
                                                <Button
                                                    onClick={onClickInvite.bind(this, result)}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    kết bạn
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modalAddFriendFooter">
                            <Button onClick={handleClose} variant="contained">
                                Thoát
                            </Button>
                            <Button variant="contained" onClick={onClickToSearch} color="primary">
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
            {/* tạo nhóm */}
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={openGroup}
                onClose={handleCloseModalGroup}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openGroup}>
                    <div className={`${classes.paper} modalAddGroup`}>
                        <div className="modalAddFriendHeader">
                            <p>Tạo nhóm</p>
                            <button onClick={handleCloseModalGroup}>&#10005;</button>
                        </div>
                        <div className="modalAddFriendBody">
                            <div className="modalAddFriendInput">
                                <Avatar>
                                    <Groups2RoundedIcon />
                                </Avatar>
                                <input
                                    type="text"
                                    value={nameGroup}
                                    onChange={(e) => setNameGroup(e.target.value)}
                                    placeholder="Nhập tên nhóm"
                                />
                            </div>
                            <div className="modalSearchInput">
                                <div className="groupRadioButton">
                                    <Radio
                                        checked={selectedValue === 'a'}
                                        onChange={handleChange}
                                        value="a"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'A' }}
                                    />
                                    <span>Tìm theo tên</span>
                                    {/* <Radio
                                        checked={selectedValue === 'b'}
                                        onChange={handleChange}
                                        value="b"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'B' }}
                                    />
                                    <span>Tìm theo số điện thoại</span> */}
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Nhập để tìm kiếm"
                                    />
                                </div>
                            </div>
                            <div className="modalAddGroupResult scrollbar" id="style-scroll">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TransferList
                                        lsFr={listTempt}
                                        left={left}
                                        right={right}
                                        setLeft={setLeft}
                                        setRight={setRight}
                                        listIndex={listIndex}
                                        setSearchInput={setSearchInput}
                                        friendToCreateGroup={friendToCreateGroup.current}
                                        buttonRef={buttonRef}
                                    />
                                    {/* {result && result._id !== jwt.getUserId() && (
                                        <div className="friendItemInvite">
                                            <Avatar style={{ marginLeft: '10px' }} src={result ? result.avatar : ''} />
                                            <div style={{ flex: 1 }}>
                                                <p className="friendItemInfo">{result ? result.username : ''}</p>
                                                <p className="friendItemInfo">{result ? result.name : ''}</p>
                                            </div>
                                            <div>
                                                {}
                                                <Button
                                                    onClick={onClickInvite.bind(this, result)}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    kết bạn
                                                </Button>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                        <div className="modalAddFriendFooter">
                            <Button onClick={handleCloseModalGroup} variant="contained">
                                Thoát
                            </Button>
                            <Button ref={buttonRef} variant="contained" onClick={handleCreateGroup} color="primary">
                                Tạo nhóm
                            </Button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
