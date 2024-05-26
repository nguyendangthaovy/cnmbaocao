import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './videocall.css';
import camera from '../../icons/camera.png';
import invite from '../../icons/invite.png';
import mic from '../../icons/mic.png';
import phone from '../../icons/phone.png';
import { useParams } from 'react-router-dom';
import { socket } from '../../utils/socketClient';
import jwt from '../../utils/jwt';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
function VideoCall() {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const cameraBtnRef = useRef(null);
    const micBtnRef = useRef(null);
    const peerInstance = useRef(null);
    const [myid, setMyid] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const id = useRef();
    const handleMyId = () => {
        // console.log(id.current.value);
        setMyid(id.current.value);
    };
    const handleMyId1 = (id) => {
        console.log('handle 1', id);
        setMyid(id);
    };
    useEffect(() => {
        if (!loading) {
            handleMyId1(jwt.getUserId());
            if (userId !== 'accept') {
                call(userId);
            }
        }
    }, [loading]);
    let toggleCamera = async () => {
        if (localStream) {
            let videoTrack = localStream.getTracks().find((track) => track.kind === 'video');

            if (videoTrack.enabled) {
                videoTrack.enabled = false;
                cameraBtnRef.current.style.backgroundColor = 'rgb(255, 80, 80)';
            } else {
                videoTrack.enabled = true;
                cameraBtnRef.current.style.backgroundColor = 'rgb(179, 102, 249, .9)';
            }
        }
    };
    let toggleMic = async () => {
        if (!localStream) return;

        let audioTrack = localStream.getTracks().find((track) => track.kind === 'audio');
        if (audioTrack.enabled) {
            micBtnRef.current.style.backgroundColor = 'rgb(255, 80, 80)';
            audioTrack.enabled = false;
        } else {
            audioTrack.enabled = true;
            micBtnRef.current.style.backgroundColor = 'rgb(179, 102, 249, .9)';
        }
        console.log(localStream);
    };

    const handleLeave = async () => {
        
        if (peerInstance.current) peerInstance.current.disconnect();
    };
    useEffect(() => {
        if (myid) {
            const peer = new Peer(myid);

            peer.on('open', (id) => {
                setPeerId(id);
            });

            peer.on('call', (call) => {
                var getUserMedia =
                    navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                getUserMedia({ video: true, audio: true }).then((mediaStream) => {
                    setLocalStream(mediaStream);
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();
                    call.answer(mediaStream);
                    call.on('stream', function (remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    });
                });
            });
            peer.on('disconnected', function() {
                
                socket.emit('end-call', userId)
                    window.close();
            })
            peerInstance.current = peer;
            
        }
        
    }, [myid]);
    useEffect(()=> {
        socket.on('end-call', (idCall)=>{
            console.log("END CALL");
            window.close();
        })
    }, [])
    const call = (remotePeerId) => {
        var getUserMedia =
            navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }).then((mediaStream) => {
            setLocalStream(mediaStream);
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();

            const call = peerInstance.current.call(remotePeerId, mediaStream);

            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
            });
        });
    };
    useEffect(() => {
        if (userId === 'accept') {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    }, []);
    if (loading) {
        return (
            <div style={{ width: '100%' }}>
                <h1>please wait a few second ....</h1>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    return (
        <div className="App">
            {/* <h1>Current user id is {peerId}</h1>

            <input type="text" ref={id} />
            <button onClick={handleMyId}>SetID</button>

            <input type="text" value={remotePeerIdValue} onChange={(e) => setRemotePeerIdValue(e.target.value)} />
            <button onClick={() => call(remotePeerIdValue)}>Call</button> */}
            <div>
                <div id="videos">
                    <video
                        ref={currentUserVideoRef}
                        className="video-player smallFrame"
                        id="user-1"
                        autoPlay
                        playsInline
                    ></video>
                    <video ref={remoteVideoRef} className="video-player" id="user-2" autoPlay playsInline></video>
                </div>

                <div id="controls">
                    <div ref={cameraBtnRef} className="control-container" id="camera-btn" onClick={toggleCamera}>
                        <img src={camera} alt="camera" />
                    </div>

                    <div ref={micBtnRef} className="control-container" id="mic-btn" onClick={toggleMic}>
                        <img src={mic} alt="mic" />
                    </div>

                    <div className="control-container" id="leave-btn" onClick={handleLeave}>
                        <img src={phone} alt="phone" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VideoCall;
