import { Divider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { navSelector } from '../../store/reducers/nav/NavSlice';
import SearchInput from '../SearchInput/SearchInput';
import SelectMyChat from '../SelectMyChat/SelectMyChat';
import ListConversation from './List/ListConversation';
import ListFriend from './ListFriend/ListFriend';
import ListInviteFriend from './ListInviteFriend/ListInviteFriend';
import ListMeInvited from './ListMeInvited/ListMeInvited';
import './myChat.css';

const MyChat = ({ socket }) => {
    const tabIndex = useSelector(navSelector);
    const [tab, setTab] = useState(tabIndex);
    useEffect(() => {
        setTab(tabIndex);
    }, [tabIndex]);
    return (
        <div className="myChat">
            <div className="myChatHeader">
                <SearchInput />
                {/* <div style={{ flex: '1' }}>tag</div> */}
            </div>
            <div className="myChatList scrollbar" id="style-scroll">
                {tab === 0 && <SelectMyChat socket={socket} />}
                {tab === 1 && (
                    <div>
                        <p style={{ textAlign: 'start', paddingLeft: '10px', fontWeight: '500' }}>
                            Danh sách đã gửi lời mời kết bạn
                        </p>
                        <ListMeInvited/>  <Divider />
                        <p style={{ textAlign: 'start', paddingLeft: '10px', fontWeight: '500' }}>
                            Danh sách lời mời kết bạn
                        </p>
                        <ListInviteFriend /> <Divider />
                        <p style={{ textAlign: 'start', paddingLeft: '10px', fontWeight: '500' }}>Danh sách bạn bè</p>
                        <ListFriend></ListFriend>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChat;
