import { useEffect, useState } from 'react'
import { useContext } from 'react'
import MediaContext from '../contexts/MediaContext'
import socket from '../services/socket';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';

function Room() {
    const {isAudio , isVideo , stream , setIsAudio , setIsVideo , name} = useContext(MediaContext);
    const {roomId} = useParams();
    const localVideoRef = useRef(null);
    const peerConnections = useRef({});
    const [participants , setParticipants] = useState([]);
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
    <main className="room-page">
        <section className="room-topbar">
            <div>
                <p className="panel-kicker">Room</p>
                <h1>{roomId}</h1>
            </div>
            <div className="room-status">
                <span className="status-dot"></span>
                <p>{Object.keys(participants).length} in call</p>
            </div>
        </section>

        <section className="video-grid">
            <article className="video-tile local-tile">
                <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
/>
                {!isVideo && <div className="camera-off">Camera off</div>}
                <div className="tile-name">{name || 'You'}</div>
            </article>

  {/* <video
    ref={remoteVideoRef}
    autoPlay
    playsInline
/> */}

{console.log("Participants:", participants)}
   {
    Object.entries(participants)
    .filter(([userId]) => userId !== socket.id)
        .map(([userId, participant]) => (

            <article className="video-tile" key={userId}>

                {
                    participant.stream &&
                    (
                        <VideoPlayer
                            stream={participant.stream}
                        />
                    )
                }
                {!participant.stream && <div className="waiting-tile">Waiting for video</div>}
                <div className="tile-name">{participant.name}</div>

            </article>

        ))
}
        </section>

        <section className="room-controls">
            <button className={`control-btn ${!isAudio ? 'is-off' : ''}`} onClick={toggleMic} aria-label={isAudio ? 'Mute microphone' : 'Unmute microphone'}>
    {isAudio ? (<i className="fa-solid fa-microphone"></i>) : (<i className="fa-solid fa-microphone-slash"></i>)}
            </button>

            <button className={`control-btn ${!isVideo ? 'is-off' : ''}`} onClick={toggleVideo} aria-label={isVideo ? 'Turn camera off' : 'Turn camera on'}>
        {isVideo ? <i className="fa-solid fa-video"></i> : <i className="fa-solid fa-video-slash"></i>}
            </button>
        </section>
    </main>
  )
}
export default Room
