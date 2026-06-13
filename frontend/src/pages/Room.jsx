import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import MediaContext from '../contexts/MediaContext'
import socket from '../services/socket';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';

function Room() {
    const {isAudio , isVideo , stream , setStream , setIsAudio , setIsVideo , name , setName} = useContext(MediaContext);
    const {roomId} = useParams();
    const localVideoRef = useRef(null);
    const peerConnections = useRef({});
    const [participants , setParticipants] = useState([]);
    const [remoteStreams , setRemoteStreams] = useState({});
    const createPeerConnection = (userId) => {

    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });

    pc.onicecandidate = (event)=>{
        if(event.candidate){
                socket.emit(
            "ice-candidate",
            {
                target: userId,
                candidate:
                    event.candidate
            }
        );
        }
    }
    pc.onconnectionstatechange =
    () => {

        console.log(
            pc.connectionState
        );

    };

           pc.ontrack = (event) => {

    // setRemoteStreams(prev => ({
    //     ...prev,
    //     [userId]: event.streams[0]
    // }));
    setParticipants(prev => ({
    ...prev,
    [userId]: {
        ...prev[userId],    
        stream: event.streams[0]
    }
}));

};

    console.log(
        "Remote stream received"
    );

        if(stream){
    stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
    });
}
        // if a connection is established use this track

    peerConnections.current[userId] = pc;

    return pc;
};
    useEffect(()=>{
      socket.emit("join-room" , {
            roomId , name
        })  
        socket.on("user-joined" , async(data)=>{
            setParticipants(prev => ({
    ...prev,
    [data.userId]: {
        name: data.name,
        stream: null
    }
}));
const pc = createPeerConnection(data.userId);
// lets say b connected so it will send req to a and a will create peer connection and then a will give offer and at that time b will create its own pper connection
            // nwo we will send offer to b
            const offer = await pc.createOffer();
            await pc.setLocalDescription(
    offer
);

        socket.emit(
    "offer",
    {
        target: data.userId,
        offer
    }
);

        })

        socket.on("offer" , async({sender , offer})=>{
       let pc =
    peerConnections.current[sender];
if(!pc){
    pc = createPeerConnection(sender);
}
        await pc.setRemoteDescription(
    offer
);      
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(
    answer
);
    socket.emit(
    "answer",
    {
        target: sender,
        answer
    }
);
    })

       socket.on(
    "answer",
    async ({
        sender,
        answer
    }) => {
        const pc = peerConnections.current[sender];
        await pc.setRemoteDescription(answer);

    }
);
       socket.on(
    "ice-candidate",
    async ({
        sender,
        candidate
    }) => {
           const pc = peerConnections.current[sender];
if (!pc) return;
await pc.addIceCandidate(candidate);
    }
);
socket.on(
    "existing-users",
    (users) => {

        const newParticipants = {};

        users.forEach(user => {

            newParticipants[user.userId] = {
                name: user.name,
                stream: null
            };

        });

        setParticipants(newParticipants);

    }
);

return () => {
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
};

    } , []);

        useEffect(() => {
    if(stream && localVideoRef.current){
        localVideoRef.current.srcObject = stream;
    }
}, [stream]);
   const toggleMic = ()=>{
         if (!stream) return;
        if(stream.getAudioTracks()[0].enabled){
            // then turn it off
            setIsAudio(false);
            stream.getAudioTracks()[0].enabled = false;
        }
        else{
            setIsAudio(true);
            stream.getAudioTracks()[0].enabled = true;
        }
    }
       const toggleVideo = ()=>{
         if (!stream) return;
        if(stream.getVideoTracks()[0].enabled){
            // then turn it off
            setIsVideo(false);
            stream.getVideoTracks()[0].enabled = false;
        }
        else{
            setIsVideo(true);
            stream.getVideoTracks()[0].enabled = true;
        }
    }
  return (
    <>
    <p>Local Stream :</p>

    <p>{name}</p>
    {isAudio ? (<i className="fa-solid fa-microphone" onClick={toggleMic}></i>) : (<i className="fa-solid fa-microphone-slash" onClick={toggleMic}></i>)}

        {isVideo ? <i className="fa-solid fa-video" onClick={toggleVideo}></i> : <i className="fa-solid fa-video-slash" onClick={toggleVideo}></i>}
    <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
/>
  <p>Remote Stream :</p>
  {/* <video
    ref={remoteVideoRef}
    autoPlay
    playsInline
/> */}
   {
    Object.entries(participants)
    .filter(([userId]) => userId !== socket.id)
        .map(([userId, participant]) => (

            <div key={userId}>
                <p>{participant.name}</p>

                {
                    participant.stream &&
                    (
                        <VideoPlayer
                            stream={participant.stream}
                        />
                    )
                }

            </div>

        ))
}

    </>
  )
}
export default Room