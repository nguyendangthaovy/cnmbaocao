import './listInviteFriend.css';
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
import { acceptFriend, deleteInviteAsync, listFriendInviteSelector } from '../../../store/reducers/friendReducer/friendReducer';
import { useDispatch, useSelector } from 'react-redux';

const ITEM_HEIGHT = 48;

export default function ListInviteFriend() {
    const dispatch = useDispatch();
    const listInvite = useSelector(listFriendInviteSelector);
    const [list, setList] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [idMe, setIdMe] = React.useState();
    const [option, setOption] = React.useState({
        isEmpty: true,
        idRequest: ''
    })
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleChoose = (id) => {
        setOption({
            isEmpty: false,
            idRequest: id
        })

    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAccept = (id) => {
        handleClose();
        // console.log(id);
        dispatch(acceptFriend(id));
    };
    const handleDeleteInvite = (id) => {
        handleClose();
        // if(listInvite){
        //     setIdMe(listInvite[0].receiverId);
        //     dispatch(deleteInvive(id));
        // }
        dispatch(deleteInviteAsync(id));
    };
    React.useEffect(() => {
        setList(listInvite);
    }, [listInvite]);

    const MenuRequest = ({ option }) => {
        if (!option.isEmpty)
            return (
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
                    <MenuItem
                        className="optionItem"
                        key={1}
                        selected={1 === 'Pyxis'}
                        onClick={handleAccept.bind(this, option.idRequest)}
                    >
                        chấp nhận
                    </MenuItem>
                    <MenuItem className="optionItem" key={2} selected={2 === 'Pyxis'}
                        onClick={handleDeleteInvite.bind(this, option.idRequest)}
                    >
                        xóa yêu cầu
                    </MenuItem>
                </Menu>

            )
    }

    return (
        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {list &&
                list.map((friend) => {
                    const labelId = `checkbox-list-secondary-label-${friend._id}`;
                    return (
                        <div key={friend._id}>
                            <ListItem
                                key={friend._id}
                                secondaryAction={
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={open ? 'long-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={e => { handleClick(e); handleChoose(friend._id) }}
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
                        </div>
                    );
                })}
            < MenuRequest option={option} />
            {list.length === 0 && <p>chưa có lời mời nào</p>}
        </List>
    );
}
