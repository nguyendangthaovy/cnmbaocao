import './listFriend.css';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteFriendAsync, listFriendSelector } from '../../../store/reducers/friendReducer/friendReducer';
import { useDispatch, useSelector } from 'react-redux';
import ModalProfileFriend from './ModalProfileFriend';
import { useState } from 'react';
import { apiUser } from '../../../api/apiUser';

const options = ['trang cá nhân', 'hủy kết bạn'];

const ITEM_HEIGHT = 48;

export default function ListFriend() {
    const listFriend = useSelector(listFriendSelector);
    const [list, setList] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [openProfile, setOpenProfile] = React.useState(false);
    const [friendProfile, setFriendProfile] = useState();
    const dispatch = useDispatch()
    const handleOpenProfile = (e) => {
        e.preventDefault();
        setOpenProfile(true);
    };
    const handleCloseProfile = () => {
        setOpenProfile(false);
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDeleteFriend = (e) => {
        e.preventDefault()
        if(friendProfile){
            setAnchorEl(null);
            const id = friendProfile._id;
            dispatch(deleteFriendAsync(id))
            
        }else
            console.log("delete fail")
        
    };
    React.useEffect(() => {
        if (listFriend) setList(listFriend);
    }, [listFriend]);
    return (
        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {list &&
                list.map((friend) => {
                    const labelId = `checkbox-list-secondary-label-${friend._id}`;
                    return (
                        <ListItem
                            // onClick={handleClick.bind(this+1, friend)}
                            key={friend._id}
                            secondaryAction={
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                        setAnchorEl(e.currentTarget);
                                        setFriendProfile(friend);
                                    }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Avatar n°${friend.name + 1}`}
                                        src={friend.avatar ? friend.avatar : friend.name}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={friend.name} />
                            </ListItemButton>

                        </ListItem>

                    );

                })}
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem onClick={option === 'trang cá nhân' ? handleOpenProfile : handleDeleteFriend} className="optionItem" key={option} selected={option === 'Pyxis'}>
                        {option}
                    </MenuItem>

                ))}
                <ModalProfileFriend friend={friendProfile} openProfilee={openProfile} closeProfile={handleCloseProfile} />
            </Menu>
        </List>
    );
}
