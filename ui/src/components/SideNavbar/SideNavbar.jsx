import { Avatar, Tooltip, tooltipClasses } from '@mui/material';
import './sideNavbar.css';
import styled from 'styled-components';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PermContactCalendarOutlinedIcon from '@material-ui/icons/PermContactCalendarOutlined';
import CloudIcon from '@material-ui/icons/Cloud';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { logout } from '../../store/reducers/loginReducer/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { meSelector } from '../../store/reducers/userReducer/meReducer';
import { navSelector, setIndex } from '../../store/reducers/nav/NavSlice';
import { toTalUnreadSelector } from '../../store/reducers/conversationReducer/conversationSlice';
import ModalProfile from './ModalProfile/ModalProfile';
import { useState } from 'react';
// import { userSelector } from '../../store/reducers/userReducer/userSlice';

const SideNavbar = () => {
    // const user = userSelector(userSelector);
    // console.log(user === undefined);
    const toTalUnread = useSelector(toTalUnreadSelector);
    const tabIndex = useSelector(navSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const profile = useSelector(meSelector);
    const [openProfile, setOpenProfile] = React.useState(false);
    const [activeNav , setActiveNav] = useState(0);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logout());
        setTimeout(() => {
            window.location.reload();
        }, 700);
        setAnchorEl(null);

    };
    let i;
    const handleNavClick = (index) => {
        setActiveNav(index)
        dispatch(setIndex(index));
        setAnchorEl(null);
    };
    const handleOpenProfile = () => {
        setOpenProfile(true);
    };
    const handleCloseProfile = () => {
        setOpenProfile(false);
    };
    return (
        <div className="sideNavbar">
            <div style={{ padding: '25px 0' }}>
                <LightTooltip placement="right" title={profile && profile.name}>
                    <Avatar
                        onClick={handleClick}
                        style={{ color: `${profile && !profile.avatar ? profile.avatarColor : ''}` }}
                        src={profile && profile.avatar ? profile.avatar : ''}
                    />
                </LightTooltip>
            </div>

            <div className="mid-icon">
                <LightTooltip placement="right" title="tin nhắn">
                    <div style={{ position: 'relative' }}>
                        <ChatRoundedIcon onClick={handleNavClick.bind(this, 0)} className={activeNav ===0 ? "icon active": "icon" } />
                        {toTalUnread > 0 && (
                            <div style={{ alignSelf: 'center' }}>
                                <Avatar
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '14px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}
                                    className="numberUnread"
                                >
                                    {toTalUnread}
                                </Avatar>
                            </div>
                        )}
                    </div>
                </LightTooltip>

                <LightTooltip placement="right" title="danh bạ">
                    <div style={{ position: 'relative' }}>
                        <PermContactCalendarOutlinedIcon onClick={handleNavClick.bind(this, 1)} className={activeNav ===1 ? "icon active": "icon" } />
                        {/* <div style={{ alignSelf: 'center' }}>
                            <Avatar
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '14px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                }}
                                className="numberUnread"
                            >
                                3
                            </Avatar>
                        </div> */}
                    </div>
                </LightTooltip>
            </div>
            <div className="bottom-icon">
                <LightTooltip placement="right" title="Cloud">
                    <CloudIcon className="icon" />
                </LightTooltip>
                <LightTooltip placement="right" title="cài đặt" onClick={handleClick}>
                    <SettingsOutlinedIcon className="icon" />
                </LightTooltip>
            </div>

            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleOpenProfile}>Cá nhân</MenuItem>
                <ModalProfile openProfilee={openProfile} closeProfile ={handleCloseProfile}/>
                <MenuItem onClick={handleClose}>Cài đặt</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
        </div>
    );
};
export const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'black',
            color: 'white',
            fontSize: 13,
        },
    }),
);
export default SideNavbar;
