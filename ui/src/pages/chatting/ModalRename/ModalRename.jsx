import { Avatar, Backdrop, Button, Fade, makeStyles, Modal, TextField } from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConversations } from "../../../api/apiConversation";

import '../../../components/SideNavbar/ModalProfile/modalProfile.css';
import conversationReducer, { reName } from "../../../store/reducers/conversationReducer/conversationSlice";
import { handleRenameGroup } from "../../../store/reducers/messageReducer/messageSlice";
const useStyles = makeStyles((theme) => ({
    paper: {
        width: '350px',
        height: '250px',
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        borderRadius: '5px',
        boxShadow: theme.shadows[5],

    },
}));

const ModalRename = (props) => {
    const classes = useStyles();
    const openModalRename = props.openModalRename;
    const infoRoom = props.infoRoom;
    const [conversationId, setIdRoom] = useState();
    const [name, setName] = useState();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(infoRoom){
            setIdRoom(infoRoom._id)
            setName(infoRoom.name)
        } 
    },[infoRoom]);
    const onRename = async (e)=>{
        e.preventDefault();
        if(conversationId && name){
            dispatch(
                reName({conversationId: conversationId,name: name})
            )
            dispatch(handleRenameGroup())
        }
            // await apiConversations.reNameConversation({conversationId,name})
        console.log("aaaa", props.conversation)
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className='modal-profile'
            open={openModalRename}
            onClose={props.closeModalRename}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={openModalRename}>
                {infoRoom &&
                    <div className={classes.paper}>
                        <div className='profile-bao'>
                            <div>
                                <h6>Chỉnh sửa tên cuộc trò chuyện</h6>
                            </div>
                            <div>
                                <button className="btn-close" onClick={props.closeModalRename}></button>
                            </div>

                        </div>
                        <div className='profile-info-bao'>
                            <TextField fullWidth value={name? name :""} onChange={e=>setName(e.target.value)}/>
                        </div>
                        <div className="btn-go-update">
                            <Button style={{ backgroundColor: '#E5E7EB' }} fullWidth={true} onClick={onRename}>
                               Chỉnh sửa
                            </Button>

                        </div>
                    </div>
                }

            </Fade>
        </Modal>
    )
}
export default ModalRename;