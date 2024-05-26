import React, { useRef, useState } from 'react';
import './selectStyle.css';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core';

import ListConversation from '../MyChat/List/ListConversation';
import ListFriend from '../MyChat/ListFriend/ListFriend';
import ListInviteFriend from '../MyChat/ListInviteFriend/ListInviteFriend';
import { useDispatch, useSelector } from 'react-redux';
import { navSelector, setIndex } from '../../store/reducers/nav/NavSlice';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabUnstyled from '@mui/base/TabUnstyled';

const useStyles = makeStyles((theme) => ({
    root: {},
}));

export default function SelectMyChat({ socket }) {
    const navIndex = useSelector(navSelector);
    const dispatch = useDispatch();
    const handleChange = (event, newValue) => {
        dispatch(setIndex(newValue + ''));
    };

    const handleChangeIndex = (index) => {
        dispatch(setIndex(index + ''));
    };

    return (
        <TabsUnstyled className='tab-bao' defaultValue={0}>
            <div className='div-bao'>
                <TabsListUnstyled className="selectorTabList">
                    <TabUnstyled className="selectorTab tab-all">Tất cả</TabUnstyled>
                    <TabUnstyled className="selectorTab tab-friend">Bạn bè</TabUnstyled>
                    <TabUnstyled className="selectorTab tab-invit">Lời mời</TabUnstyled>
                </TabsListUnstyled>
            </div>
            <TabPanelUnstyled value={0}>
                <ListConversation socket={socket} />
            </TabPanelUnstyled>
            <TabPanelUnstyled value={1}>
                <ListFriend />
            </TabPanelUnstyled>
            <TabPanelUnstyled value={2}>
                <ListInviteFriend />
            </TabPanelUnstyled>
        </TabsUnstyled>


    );
}
